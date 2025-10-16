







import { useState } from 'react';

export enum MenuType {
    descr = 'descr',
    sost = 'sost',
    dil = 'dil',
    size = 'size'
}

export interface MenuItem {
    key: MenuType;
    label: string;
    content: string | React.ReactNode;
}

export const useMenu = (): {
    menu: MenuType;
    setMenu: (menu: MenuType) => void;
    toggles: boolean[];
    menuItems: MenuItem[];
    toggleMenu: (index: number) => void;
} => {
    const [menu, setMenu] = useState<MenuType>(MenuType.descr);
    const [toggles, setToggles] = useState<boolean[]>(Array(4).fill(false));

    const menuItems: MenuItem[] = [
        {
            key: MenuType.descr,
            label: 'ОПИСАНИЕ',
            content: `Lorem ipsum dolor sit amet consectetur. A nulla lacus ac sed ullamcorper vitae at sem elementum...`
        },
        {
            key: MenuType.sost,
            label: 'СОСТАВ',
            content: 'composition'
        },
        {
            key: MenuType.dil,
            label: 'ДОСТАВКА',
            content: `Доставка осуществляется в течение 3–5 рабочих дней. Мы предлагаем бесплатную доставку при заказе от 50 000 РУБ.`
        },
        {
            key: MenuType.size,
            label: 'РАЗМЕРЫ',
            content: 'sizes'
        }
    ];

    const toggleMenu = (index: number) => {
        setToggles((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return {
        menu,
        setMenu,
        toggles,
        menuItems,
        toggleMenu
    };
};