import { Alert, Slide, Snackbar, type SlideProps } from "@mui/material";
import { useToastStore } from "../../stores/toastStore";

const SlideLeftTransition = (props: SlideProps) => <Slide {...props} direction="left" />;

export const AppToast = () => {
  const { open, message, severity, hideToast } = useToastStore();

  return (
    <Snackbar
      open={open}
      autoHideDuration={3500}
      onClose={hideToast}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={SlideLeftTransition}
    >
      <Alert
        onClose={hideToast}
        severity={severity}
        variant="filled"
        sx={(theme) => ({
          width: "100%",
          minWidth: 320,
          boxShadow: theme.shadows[8],
          "&.MuiAlert-filledError": {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          },
        })}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
