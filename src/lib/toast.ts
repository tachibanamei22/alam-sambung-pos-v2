import Swal from "sweetalert2";

export function successToast(message: string) {
  Swal.fire({
    toast: true,
    position: "top",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
}
