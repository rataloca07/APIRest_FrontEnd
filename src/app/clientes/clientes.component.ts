import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente.model';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './detalle/modal.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado:Cliente;


  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private modalService:ModalService) { }

  ngOnInit() {
 
    this.activatedRoute.paramMap.subscribe(params => {
      let page:number = +params.get('page');
      if(!page){
        page=0;
      }
      this.clienteService.getClientes(page).subscribe(
        //(clientes: Cliente[]) => this.clientes = clientes
        (response: any) => {
          this.clientes = response.content as Cliente[];
          this.paginador= response;
        }
      );
    });

    this.modalService.notificarSubida.subscribe(cliente=>{
      this.clientes.map(clienteOriginal =>{
        if(clienteOriginal.id == cliente.id){
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
  }

  delete(cliente: Cliente) {
    const swalWithBootstrapButtons = Swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    })

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {

      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            this.clientes = this.clientes.filter(cli => cli != cliente)
            Swal.fire('Eliminado!', `Cliente ${cliente.nombre} Eliminado con Éxito`, 'success')
          }
        );
      }
    })
  }

  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
