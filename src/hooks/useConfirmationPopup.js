import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"

export const useConfirmationPopup = () => {
  const { t } = useTranslation()

  const showConfirmationPopup = async (yesButtonAction, noButtonAction) => {
    const result = await Swal.fire({
      title: t("popUpChanges"),
      showCancelButton: true,
      confirmButtonText: t("confirmChanges"),
      cancelButtonText: t("denyButton"),
      allowOutsideClick: false,
    })

    if (result.isConfirmed && yesButtonAction) {
      yesButtonAction()
    } else if (result.isConfirmed === false && noButtonAction) {
      noButtonAction()
    }
  }

  return {
    showConfirmationPopup,
  }

}
