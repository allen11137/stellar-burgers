import { ListIcon } from '@zlden/react-developer-burger-ui-components';
import { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { BurgerIcon, Logo } from '@zlden/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';
import { ProfileIcon } from '@zlden/react-developer-burger-ui-components';
import clsx from 'clsx';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink to='/' className={({ isActive }) => clsx(styles.link, isActive && styles.link_active)} end>
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
            </>
          )}
        </NavLink>
        <NavLink to='/feed' className={({ isActive }) => clsx(styles.link, isActive && styles.link_active)}>
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </>
          )}
        </NavLink>
      </div>

      <NavLink to='/' className={styles.link}>
        <div className={styles.logo}>
          <Logo className={styles.logo_icon} />
        </div>
      </NavLink>

      <div className={styles.link_position_last}>
        <NavLink to='/profile' className={({ isActive }) => clsx(styles.link, isActive && styles.link_active)}>
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default ml-2'>{userName || 'Личный кабинет'}</p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);