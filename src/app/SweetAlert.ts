import Swal from "sweetalert2"

export function onSuccess(content:string){
  const Toast = Swal.mixin({
    toast:true,
    position: 'top-end',
    customClass:{
      popup:'colored-toast'
    },
    showConfirmButton:false,
    timer:1500,
    timerProgressBar: false
  })
  Toast.fire({
    icon: 'success',
    title: content,
    background: 'green' ,
    color: 'white'
  })
}
export function onError(content:string){
  const Toast = Swal.mixin({
    toast:true,
    position: 'top-end',
    customClass:{
      popup:'colored-toast'
    },
    showConfirmButton:false,
    timer:3000,
    timerProgressBar: false
  })
  Toast.fire({
    icon: 'error',
    title: content,
    background:'red',
    color: 'white'
  })
}

export function onSessionExpired(){
  Swal.fire({
    icon: 'warning',
    title: 'Oops...',
    text: 'Your Session is Ended! Please Login again',
  })
}
 export function onGameAdded(){
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Game Added Successfully!',
    showConfirmButton: false,
    timer: 1500
  })
 }

