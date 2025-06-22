import { useSelector } from '../../services/store';
import { selectAllIngredients } from '../../slices/ingredients';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useInView } from 'react-intersection-observer';
import { FC, useEffect, useRef, useState } from 'react';
import { TTabMode } from '@utils-types';

export const BurgerIngredients: FC = () => {
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const ingredients = useSelector(selectAllIngredients);
  const buns = ingredients.filter(i => i.type === 'bun');
  const mains = ingredients.filter(i => i.type === 'main');
  const sauces = ingredients.filter(i => i.type === 'sauce');

  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewFilling] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);
    const refs = {
      bun: titleBunRef,
      main: titleMainRef,
      sauce: titleSaucesRef
    };
    refs[tab as TTabMode].current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (inViewBuns) setCurrentTab('bun');
    else if (inViewSauces) setCurrentTab('sauce');
    else if (inViewFilling) setCurrentTab('main');
  }, [inViewBuns, inViewFilling, inViewSauces]);

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};