import { Id, toast, ToastContainer } from 'react-toastify';
import Trans from 'next-translate/Trans';

export const pendingNotification = ({
  title,
  subtitle,
  id,
}: {
  title: string;
  subtitle?: string;
  id: string | number;
}) =>
  toast(
    <>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          <Trans i18nKey={title} />
        </p>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            <Trans i18nKey={subtitle} />
          </p>
        )}
      </div>
    </>,
    {
      type: 'default',
      autoClose: 10_000,
      toastId: `${id}Pending`,
    },
  );

export const NotificationDisplay = () => (
  <ToastContainer
    position="bottom-right"
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);

export const depositSuccessNotification = () => {
  toast.dismiss();
  toast('Deposit Successful', { type: 'success' });
};

export const approvalSuccessNotification = () => {
  toast.dismiss();
  toast('Approval Successful!', { type: 'success' });
};

export const errorNotification = (err: string) => {
  toast.dismiss();
  toast(`Deposit Failed... ${err}`, { type: 'error' });
};

export const walletSubmittedNotification = () => toast('Transaction approved!');

export const successNotificationUpdate = (toastId: Id) => {
  toast.dismiss(`${toastId}Pending`);
  toast(
    <>
      <div className="ml-3 flex-1" data-cy={`${toastId}Success`}>
        <p className="text-sm font-medium text-gray-900">
          <Trans i18nKey={`${toastId}Success`} />
        </p>
      </div>
    </>,
    {
      type: 'success',
      autoClose: 10000,
      toastId: `${toastId}Success`,
    },
  );
};

export const errorNotificationUpdate = (toastId: Id) => {
  toast.dismiss(`${toastId}Pending`);
  toast(
    <>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">
          <Trans i18nKey={`${toastId}Error`} />
        </p>
      </div>
    </>,
    {
      type: 'error',
      autoClose: 10000,
      toastId: `${toastId}Error`,
    },
  );
};