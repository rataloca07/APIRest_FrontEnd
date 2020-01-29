import { Component, OnInit, Input } from '@angular/core';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '../cliente.model';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  //cliente: Cliente;
  @Input() cliente: Cliente;
  titulo: string = "Detalle Cliente";
  private fotoSeleccionada: File;
  nombreFoto:string="Seleccionar foto";
  progreso: number = 0;

  //modal: boolean=true;



  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    public modalService: ModalService) { }

  ngOnInit() {
     
    //Se obtenia el cliente por id con routerLink[]
    /*this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
          console.log("Cliente obtenido: " + this.cliente.nombre);
        });
      }
    });*/
  }
  /*ngOnChanges(changes: SimpleChanges): void {
    this.modal=this.modalService.modal;

  }*/

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error upload', 'El archivo debe ser de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
    else{
      if(this.fotoSeleccionada.name.length>15){
        this.nombreFoto =this.fotoSeleccionada.name.slice(0,15)+"...";
      }
      else{
        this.nombreFoto =this.fotoSeleccionada.name;
      }
      
    }

  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal.fire('Error upload', 'Debe seleccionar una foto', 'error');

    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progreso = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notificarSubida.emit(this.cliente);
          swal.fire('La foto se ha subido correctamente', response.mensaje, 'success');
          this.progreso = 0;
          this.fotoSeleccionada = null;
        }

        // this.cliente=cliente;

      });
    }

  }

  cerrarModal(){
    this.modalService.cerrarModal();
   /* this.modalService.cerrarModal();
    this.modal=this.modalService.modal;*/
    this.fotoSeleccionada=null;
    this.nombreFoto="Seleccione imagen";
    this.progreso=0;

  }

}
