import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal:boolean=false;

  _notificarSubida= new EventEmitter<any>();

  constructor() { }


  get notificarSubida():EventEmitter<any>{
    return this._notificarSubida;

  }

  abrirModal(){
    this.modal=true;

  }

  cerrarModal(){
    this.modal=false;

  }
}
