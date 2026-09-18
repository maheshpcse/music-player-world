import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

interface AlertOptions {
  timer?: number;
  timerProgressBar?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  success(title: string, text?: string, options: AlertOptions = {}) {
    return this.fire('success', title, text, options);
  }

  error(title: string, text?: string, options: AlertOptions = {}) {
    return this.fire('error', title, text, options);
  }

  warning(title: string, text?: string, options: AlertOptions = {}) {
    return this.fire('warning', title, text, options);
  }

  async confirmDelete(title: string, text: string): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      background: '#F1F6F4',
      color: '#172B36',
      iconColor: '#FF9932',
      confirmButtonColor: '#FF9932',
      cancelButtonColor: '#D9E8E2',
      customClass: {
        popup: 'music-alert-popup'
      }
    });

    return result.isConfirmed;
  }

  private fire(icon: SweetAlertIcon, title: string, text?: string, options: AlertOptions = {}) {
    return Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      text,
      showConfirmButton: false,
      timer: options.timer ?? 1500,
      timerProgressBar: options.timerProgressBar ?? true,
      width: 460,
      background: '#F1F6F4',
      color: '#172B36',
      iconColor: icon === 'success' ? '#114C5A' : icon === 'warning' ? '#FF9932' : '#c4472d',
      customClass: {
        popup: 'music-alert-popup'
      }
    });
  }
}
