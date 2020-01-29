import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente.model';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  cliente: Cliente = new Cliente();
  titulo: string = "Crear Cliente";
  errores:string[];
  regiones:Region[];


  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones=regiones);
  }

  cargarCliente() {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=> this.cliente= cliente)
      }
    }
    )
  }


  create() {
    this.clienteService.create(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes']);
          swal.fire('Nuevo Cliente', `Cliente ${json.cliente.nombre}  creado con éxito!`, 'success');
      },
      err=> {
        this.errores = err.error.errors as string[];
        console.error("Código de error desde el backend: "+err.status);
        console.error(err.error.errors);
      }
    );

  }

  update(){
    this.clienteService.update(this.cliente).subscribe(
      json =>{
        this.router.navigate(['/clientes'])
        swal.fire('Cliente Actualizado',`Cliente ${json.cliente.nombre} actualizado con éxito!`,'success')
      },
      err=> {
        this.errores = err.error.errors as string[];
        console.error("Código de error desde el backend: "+err.status);
        console.error(err.error.errors);
      }
    );
  }

  compararRegion(o1:Region,o2:Region):boolean{
    if(o1==undefined && o2==undefined){
      return true;
    }
    return o1===null || o2===null || o1===undefined || o2===undefined? false: o1.id === o2.id;

  }

}
