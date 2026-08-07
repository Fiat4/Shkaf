/**
 * Telegram bot for order notifications
 *
 * Setup:
 * 1. @BotFather → /newbot → copy token into TELEGRAM_BOT_TOKEN
 * 2. Open your bot and send /start
 * 3. Open https://api.telegram.org/bot<TOKEN>/getUpdates
 *    Take message.from.id → TELEGRAM_ADMIN_IDS (comma-separated for several admins)
 * 4. Restart the server
 *
 * If TELEGRAM_BOT_TOKEN is empty, notifications are disabled (API still works).
 */
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus, Prisma } from '@prisma/client';
import { Markup, Telegraf } from 'telegraf';
import { PrismaService } from 'src/prisma.service';

type OrderWithProduct = Prisma.OrderGetPayload<{
  include: { product: true };
}>;

type OrderTypeFilter = 'all' | 'order' | 'consultation';

const STATUS_LABEL: Record<OrderStatus, string> = {
  ACTIVE: 'Активна',
  COMPLETED: 'Завершена',
  CANCELED: 'Отменена',
};

const STATUS_CODE: Record<string, OrderStatus> = {
  A: OrderStatus.ACTIVE,
  C: OrderStatus.COMPLETED,
  X: OrderStatus.CANCELED,
};

const LIST_LIMIT = 10;

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf | null = null;
  private adminIds: number[] = [];
  private enabled = false;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async onModuleInit() {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN')?.trim();
    const adminsRaw =
      this.config.get<string>('TELEGRAM_ADMIN_IDS')?.trim() || '';

    this.adminIds = adminsRaw
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id) && id > 0);

    if (!token) {
      this.logger.warn(
        'TELEGRAM_BOT_TOKEN не задан — уведомления в Telegram отключены',
      );
      return;
    }

    if (this.adminIds.length === 0) {
      this.logger.warn(
        'TELEGRAM_ADMIN_IDS пуст — бот не запущен (нужен хотя бы один admin id)',
      );
      return;
    }

    this.bot = new Telegraf(token, {
      telegram: {
        apiRoot:
          this.config.get<string>('TELEGRAM_API_ROOT')?.trim() ||
          'https://api.telegram.org',
      },
    });
    this.registerHandlers();
    this.enabled = true;

    const apiRoot =
      this.config.get<string>('TELEGRAM_API_ROOT')?.trim() ||
      'https://api.telegram.org';
    this.logger.log(`Telegram API root: ${apiRoot}`);

    this.bot
      .launch({ dropPendingUpdates: true })
      .then(() => {
        this.logger.log(
          `Telegram-бот запущен. Админы: ${this.adminIds.join(', ')}`,
        );
      })
      .catch((err) => {
        this.enabled = false;
        this.logger.error('Не удалось запустить Telegram-бота', err);
      });
  }

  async onModuleDestroy() {
    if (this.bot) {
      this.bot.stop('Nest shutdown');
      this.bot = null;
    }
  }

  private isAdmin(userId?: number): boolean {
    return !!userId && this.adminIds.includes(userId);
  }

  private mainMenuKeyboard() {
    return Markup.keyboard([
      ['📥 Активные', '✅ Завершённые', '🚫 Отменённые'],
      ['📋 Меню', '❓ Помощь'],
    ]).resize();
  }

  private listFilterKeyboard(status: OrderStatus) {
    const code =
      status === OrderStatus.ACTIVE
        ? 'A'
        : status === OrderStatus.COMPLETED
          ? 'C'
          : 'X';
    return Markup.inlineKeyboard([
      [
        Markup.button.callback('Все', `l:${code}:a`),
        Markup.button.callback('Заказы', `l:${code}:o`),
        Markup.button.callback('Консультации', `l:${code}:c`),
      ],
    ]);
  }

  private registerHandlers() {
    if (!this.bot) return;

    this.bot.use(async (ctx, next) => {
      const userId = ctx.from?.id;
      if (!this.isAdmin(userId)) {
        if (ctx.callbackQuery) {
          await ctx.answerCbQuery('Нет доступа').catch(() => undefined);
        } else if (ctx.message) {
          await ctx.reply('Нет доступа. Ваш id не в TELEGRAM_ADMIN_IDS.');
        }
        return;
      }
      return next();
    });

    this.bot.start(async (ctx) => {
      await ctx.reply(
        'Бот заявок LockerWood.\n\n' +
          'Новые заявки приходят автоматически.\n' +
          'Ниже меню как в админке — списки и управление статусами.',
        this.mainMenuKeyboard(),
      );
      await this.sendMenu(ctx);
    });

    this.bot.help(async (ctx) => {
      await ctx.reply(this.helpText(), this.mainMenuKeyboard());
    });

    this.bot.command('menu', async (ctx) => {
      await this.sendMenu(ctx);
    });

    this.bot.command('active', async (ctx) => {
      await this.sendListPrompt(ctx, OrderStatus.ACTIVE);
    });

    this.bot.command('completed', async (ctx) => {
      await this.sendListPrompt(ctx, OrderStatus.COMPLETED);
    });

    this.bot.command('canceled', async (ctx) => {
      await this.sendListPrompt(ctx, OrderStatus.CANCELED);
    });

    this.bot.hears('📥 Активные', async (ctx) => {
      await this.sendListPrompt(ctx, OrderStatus.ACTIVE);
    });
    this.bot.hears('✅ Завершённые', async (ctx) => {
      await this.sendListPrompt(ctx, OrderStatus.COMPLETED);
    });
    this.bot.hears('🚫 Отменённые', async (ctx) => {
      await this.sendListPrompt(ctx, OrderStatus.CANCELED);
    });
    this.bot.hears('📋 Меню', async (ctx) => {
      await this.sendMenu(ctx);
    });
    this.bot.hears('❓ Помощь', async (ctx) => {
      await ctx.reply(this.helpText());
    });

    this.bot.on('callback_query', async (ctx) => {
      if (!('data' in ctx.callbackQuery) || !ctx.callbackQuery.data) {
        return;
      }

      const data = ctx.callbackQuery.data;

      // list: l:A:a | l:C:o | l:X:c
      const listMatch = /^l:([ACX]):([aoc])$/i.exec(data);
      if (listMatch) {
        const status = STATUS_CODE[listMatch[1].toUpperCase()];
        const type =
          listMatch[2] === 'o'
            ? 'order'
            : listMatch[2] === 'c'
              ? 'consultation'
              : 'all';
        await ctx.answerCbQuery();
        await this.sendOrdersList(ctx, status, type);
        return;
      }

      // delete all canceled: da:a | da:o | da:c
      const deleteAllMatch = /^da:([aoc])$/i.exec(data);
      if (deleteAllMatch) {
        const type =
          deleteAllMatch[1] === 'o'
            ? 'order'
            : deleteAllMatch[1] === 'c'
              ? 'consultation'
              : 'all';
        await this.handleDeleteAllCanceled(ctx, type);
        return;
      }

      // confirm delete one: dy:{uuid}
      const deleteConfirmMatch = /^dy:([0-9a-f-]{36})$/i.exec(data);
      if (deleteConfirmMatch) {
        await this.handleDeleteOne(ctx, deleteConfirmMatch[1]);
        return;
      }

      // ask delete one: d:{uuid}
      const deleteAskMatch = /^d:([0-9a-f-]{36})$/i.exec(data);
      if (deleteAskMatch) {
        await ctx.answerCbQuery();
        await ctx.reply(
          'Удалить эту отменённую заявку безвозвратно?',
          Markup.inlineKeyboard([
            [
              Markup.button.callback(
                'Да, удалить',
                `dy:${deleteAskMatch[1]}`,
              ),
              Markup.button.callback('Отмена', 'noop'),
            ],
          ]),
        );
        return;
      }

      if (data === 'noop') {
        await ctx.answerCbQuery('Отменено');
        try {
          await ctx.deleteMessage();
        } catch {
          /* ignore */
        }
        return;
      }

      // status: o:{uuid}:A|C|X
      const statusMatch = /^o:([0-9a-f-]{36}):([ACX])$/i.exec(data);
      if (statusMatch) {
        const orderId = statusMatch[1];
        const status = STATUS_CODE[statusMatch[2].toUpperCase()];
        if (!status) {
          await ctx.answerCbQuery('Неверный статус');
          return;
        }

        try {
          const updated = await this.prisma.order.update({
            where: { id: orderId },
            data: { status },
            include: { product: true },
          });

          await ctx.editMessageText(this.formatOrderMessage(updated), {
            parse_mode: 'HTML',
            ...this.orderKeyboard(updated.id, updated.status),
          });
          await ctx.answerCbQuery(`Статус: ${STATUS_LABEL[status]}`);
        } catch (err) {
          this.logger.error(`Ошибка смены статуса заявки ${orderId}`, err);
          await ctx.answerCbQuery('Не удалось обновить статус');
        }
        return;
      }

      await ctx.answerCbQuery('Неизвестная команда');
    });
  }

  private helpText() {
    return (
      'Команды и меню:\n' +
      '/menu — меню списков\n' +
      '/active — активные\n' +
      '/completed — завершённые\n' +
      '/canceled — отменённые\n' +
      '/help — справка\n\n' +
      'Под заявкой кнопки как в админке:\n' +
      '• Активна / Завершена / Отменена\n' +
      '• Удалить — только у отменённых\n\n' +
      'В списке отменённых есть «Удалить все».'
    );
  }

  private async sendMenu(ctx: {
    reply: (text: string, extra?: object) => Promise<unknown>;
  }) {
    await ctx.reply(
      'Выберите раздел заявок:',
      Markup.inlineKeyboard([
        [Markup.button.callback('📥 Активные', 'l:A:a')],
        [Markup.button.callback('✅ Завершённые', 'l:C:a')],
        [Markup.button.callback('🚫 Отменённые', 'l:X:a')],
      ]),
    );
  }

  private async sendListPrompt(
    ctx: { reply: (text: string, extra?: object) => Promise<unknown> },
    status: OrderStatus,
  ) {
    const title = STATUS_LABEL[status];
    await ctx.reply(
      `Фильтр для статуса «${title}» — что показать?`,
      this.listFilterKeyboard(status),
    );
  }

  private buildWhere(status: OrderStatus, type: OrderTypeFilter) {
    const where: Prisma.OrderWhereInput = { status };
    if (type === 'order') {
      where.productId = { not: null };
    } else if (type === 'consultation') {
      where.productId = null;
    }
    return where;
  }

  private typeLabel(type: OrderTypeFilter) {
    if (type === 'order') return 'заказы';
    if (type === 'consultation') return 'консультации';
    return 'все';
  }

  private async sendOrdersList(
    ctx: {
      reply: (text: string, extra?: object) => Promise<unknown>;
      answerCbQuery?: (text?: string) => Promise<unknown>;
    },
    status: OrderStatus,
    type: OrderTypeFilter,
  ) {
    const orders = await this.prisma.order.findMany({
      where: this.buildWhere(status, type),
      include: { product: true },
      orderBy: { created_at: 'desc' },
      take: LIST_LIMIT,
    });

    const total = await this.prisma.order.count({
      where: this.buildWhere(status, type),
    });

    if (orders.length === 0) {
      await ctx.reply(
        `Нет заявок: ${STATUS_LABEL[status].toLowerCase()} / ${this.typeLabel(type)}.`,
      );
      return;
    }

    await ctx.reply(
      `<b>${STATUS_LABEL[status]}</b> · ${this.typeLabel(type)}\n` +
        `Показано ${orders.length} из ${total}`,
      { parse_mode: 'HTML' },
    );

    for (const order of orders) {
      await ctx.reply(this.formatOrderMessage(order), {
        parse_mode: 'HTML',
        ...this.orderKeyboard(order.id, order.status),
      });
    }

    if (status === OrderStatus.CANCELED) {
      const typeCode = type === 'order' ? 'o' : type === 'consultation' ? 'c' : 'a';
      await ctx.reply(
        'Массовые действия для отменённых:',
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `🗑 Удалить все (${this.typeLabel(type)})`,
              `da:${typeCode}`,
            ),
          ],
        ]),
      );
    }
  }

  private async handleDeleteOne(
    ctx: {
      answerCbQuery: (text?: string) => Promise<unknown>;
      editMessageText?: (text: string, extra?: object) => Promise<unknown>;
      reply: (text: string, extra?: object) => Promise<unknown>;
    },
    orderId: string,
  ) {
    try {
      const candidate = await this.prisma.order.findUnique({
        where: { id: orderId },
      });
      if (!candidate) {
        await ctx.answerCbQuery('Заявка не найдена');
        return;
      }
      if (candidate.status !== OrderStatus.CANCELED) {
        await ctx.answerCbQuery('Удалять можно только отменённые');
        return;
      }

      await this.prisma.order.delete({ where: { id: orderId } });
      await ctx.answerCbQuery('Удалено');
      try {
        await ctx.editMessageText?.('Заявка удалена.');
      } catch {
        await ctx.reply('Заявка удалена.');
      }
    } catch (err) {
      this.logger.error(`Ошибка удаления заявки ${orderId}`, err);
      await ctx.answerCbQuery('Не удалось удалить');
    }
  }

  private async handleDeleteAllCanceled(
    ctx: {
      answerCbQuery: (text?: string) => Promise<unknown>;
      reply: (text: string, extra?: object) => Promise<unknown>;
    },
    type: OrderTypeFilter,
  ) {
    try {
      const result = await this.prisma.order.deleteMany({
        where: this.buildWhere(OrderStatus.CANCELED, type),
      });
      await ctx.answerCbQuery(`Удалено: ${result.count}`);
      await ctx.reply(
        `Удалено отменённых заявок (${this.typeLabel(type)}): <b>${result.count}</b>`,
        { parse_mode: 'HTML' },
      );
    } catch (err) {
      this.logger.error('Ошибка массового удаления отменённых', err);
      await ctx.answerCbQuery('Ошибка удаления');
    }
  }

  private orderKeyboard(orderId: string, current: OrderStatus) {
    const mark = (status: OrderStatus, label: string) =>
      current === status ? `• ${label}` : label;

    const rows = [
      [
        Markup.button.callback(
          mark(OrderStatus.ACTIVE, 'Активна'),
          `o:${orderId}:A`,
        ),
        Markup.button.callback(
          mark(OrderStatus.COMPLETED, 'Завершена'),
          `o:${orderId}:C`,
        ),
        Markup.button.callback(
          mark(OrderStatus.CANCELED, 'Отменена'),
          `o:${orderId}:X`,
        ),
      ],
    ];

    if (current === OrderStatus.CANCELED) {
      rows.push([
        Markup.button.callback('🗑 Удалить навсегда', `d:${orderId}`),
      ]);
    }

    return Markup.inlineKeyboard(rows);
  }

  /** @deprecated use orderKeyboard */
  private statusKeyboard(orderId: string, current: OrderStatus) {
    return this.orderKeyboard(orderId, current);
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  formatOrderMessage(
    order: OrderWithProduct | (OrderWithProduct & object),
  ): string {
    const type = order.productId ? 'Заказ' : 'Консультация';
    const productLine = order.product
      ? `${this.escapeHtml(order.product.name)} (${order.product.id})`
      : 'без товара';
    const comment = order.comment ? this.escapeHtml(order.comment) : '—';
    const date = new Date(order.created_at).toLocaleString('ru-RU');

    return (
      `<b>Заявка: ${type}</b>\n` +
      `ID: <code>${order.id}</code>\n` +
      `Статус: <b>${STATUS_LABEL[order.status]}</b>\n` +
      `Имя: ${this.escapeHtml(order.userName)}\n` +
      `Телефон: ${this.escapeHtml(order.tel)}\n` +
      `Email: ${this.escapeHtml(order.email)}\n` +
      `Товар: ${productLine}\n` +
      `Комментарий: ${comment}\n` +
      `Дата: ${date}`
    );
  }

  async notifyNewOrder(order: OrderWithProduct): Promise<void> {
    if (!this.enabled || !this.bot) {
      return;
    }

    const text = this.formatOrderMessage(order);
    const keyboard = this.orderKeyboard(order.id, order.status);
    let savedChatId: string | null = null;
    let savedMessageId: number | null = null;

    for (const adminId of this.adminIds) {
      try {
        const sent = await this.bot.telegram.sendMessage(adminId, text, {
          parse_mode: 'HTML',
          ...keyboard,
        });
        if (!savedChatId) {
          savedChatId = String(sent.chat.id);
          savedMessageId = sent.message_id;
        }
      } catch (err) {
        this.logger.error(
          `Не удалось отправить заявку ${order.id} админу ${adminId}`,
          err,
        );
      }
    }

    if (savedChatId && savedMessageId != null) {
      try {
        await this.prisma.order.update({
          where: { id: order.id },
          data: {
            telegramChatId: savedChatId,
            telegramMessageId: savedMessageId,
          },
        });
      } catch (err) {
        this.logger.error(
          `Не удалось сохранить telegramMessageId для ${order.id}`,
          err,
        );
      }
    }
  }

  async notifyStatusChanged(order: OrderWithProduct): Promise<void> {
    if (!this.enabled || !this.bot) {
      return;
    }

    const text = this.formatOrderMessage(order);
    const keyboard = this.orderKeyboard(order.id, order.status);

    if (order.telegramChatId && order.telegramMessageId != null) {
      try {
        await this.bot.telegram.editMessageText(
          order.telegramChatId,
          order.telegramMessageId,
          undefined,
          text,
          {
            parse_mode: 'HTML',
            ...keyboard,
          },
        );
        return;
      } catch (err) {
        this.logger.warn(
          `Не удалось отредактировать TG-сообщение заявки ${order.id}, шлём краткое уведомление`,
          err,
        );
      }
    }

    const short = `Заявка <code>${order.id}</code> → <b>${STATUS_LABEL[order.status]}</b>`;
    for (const adminId of this.adminIds) {
      try {
        await this.bot.telegram.sendMessage(adminId, short, {
          parse_mode: 'HTML',
          ...keyboard,
        });
      } catch (err) {
        this.logger.error(
          `Не удалось уведомить админа ${adminId} о статусе ${order.id}`,
          err,
        );
      }
    }
  }
}
