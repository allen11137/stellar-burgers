import { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useMatch, useNavigate } from 'react-router-dom';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { useDispatch } from '../../services/store';
import { deleteSelectedOrder } from '../../slices/orderFeedSlice';
import { fetchIngredients } from '../../slices/ingredients';
import { fetchUser } from '../../slices/userProfileSlice';
import { AppHeader } from '../app-header';
import { IngredientDetails } from '../ingredient-details';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { ProtectedRoute } from '../protected-route';
import styles from './app.module.css';
import '../../index.css';

const DetailPageLayout = ({ 
  title, 
  titleType = 'main-large', 
  children 
}: {
  title: string;
  titleType?: 'main-large' | 'digits-default';
  children: React.ReactNode;
}) => (
  <div className={styles.detailPageWrap}>
    <p className={`text text_type_${titleType} ${styles.detailHeader}`}>
      {title}
    </p>
    {children}
  </div>
);

const OrderDetailPage = ({ orderId }: { orderId?: string }) => (
  <DetailPageLayout 
    title={`#${orderId?.padStart(6, '0')}`} 
    titleType='digits-default'
  >
    <OrderInfo />
  </DetailPageLayout>
);

const IngredientDetailPage = () => (
  <DetailPageLayout title='Детали ингредиента'>
    <IngredientDetails />
  </DetailPageLayout>
);

const AuthRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute publicAccess>
    {children}
  </ProtectedRoute>
);

const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    {children}
  </ProtectedRoute>
);

const App = () => {
  const dispatch = useDispatch();
  const loc = useLocation();
  const nav = useNavigate();

  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const currentOrderId = profileMatch || feedMatch;

  const background = loc.state?.background;

  const clearSelectedOrderState = useCallback(() => {
    dispatch(deleteSelectedOrder());
  }, [dispatch]);

  const closeModal = () => {
    nav(-1);
    clearSelectedOrderState();
  };

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      
      <Routes location={background || loc}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderDetailPage orderId={currentOrderId} />} />
        <Route path='/ingredients/:id' element={<IngredientDetailPage />} />

        <Route path='/login' element={<AuthRoute><Login /></AuthRoute>} />
        <Route path='/register' element={<AuthRoute><Register /></AuthRoute>} />
        <Route path='/forgot-password' element={<AuthRoute><ForgotPassword /></AuthRoute>} />
        <Route path='/reset-password' element={<AuthRoute><ResetPassword /></AuthRoute>} />

        <Route path='/profile' element={<ProtectedRouteWrapper><Profile /></ProtectedRouteWrapper>} />
        <Route path='/profile/orders' element={<ProtectedRouteWrapper><ProfileOrders /></ProtectedRouteWrapper>} />
        <Route 
          path='/profile/orders/:number' 
          element={
            <ProtectedRouteWrapper>
              <OrderDetailPage orderId={currentOrderId} />
            </ProtectedRouteWrapper>
          } 
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={`#${currentOrderId?.padStart(6, '0')}`}
                onClose={closeModal}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${currentOrderId?.padStart(6, '0')}`}
                onClose={closeModal}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;