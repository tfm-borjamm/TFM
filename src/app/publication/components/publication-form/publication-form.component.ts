import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AuthService } from 'src/app/user/services/auth.service';
import { Publication } from '../../models/publication.model';
import { PublicationService } from '../../services/publication.service';
import { age } from 'src/app/publication/helpers/age';
import { confirmation } from 'src/app/publication/helpers/confirmation';
import { UserService } from 'src/app/user/services/user.service';
import { Location } from '@angular/common';
import { Sex } from '../../enums/sex.enum';
import { Size } from '../../enums/size.enum';
import { Type } from '../../enums/type.enum';
import { State } from '../../enums/state.enum';
import { User } from 'src/app/user/models/user.model';
import { provinces } from 'src/app/shared/helpers/provinces';

@Component({
  selector: 'app-publication-form',
  templateUrl: './publication-form.component.html',
  styleUrls: ['./publication-form.component.scss'],
})
export class PublicationFormComponent implements OnInit {
  // @ViewChild('input') input: HTMLInputElement;
  // @ViewChild('input', { static: false }) input: ElementRef;

  public publication = new Publication();
  public publicationForm: FormGroup;
  public name: FormControl;
  public description: FormControl;
  public age: FormControl;
  public size: FormControl;
  public sex: FormControl;
  public chip: FormControl;
  public type: FormControl;
  public breed: FormControl;
  public sterile: FormControl;
  public vaccinate: FormControl;
  public dewormed: FormControl;
  public image: FormControl;
  public province: FormControl;
  public sexs: any;
  public types: any;
  public sizes: any;
  public ages = age;
  public vaccinates = confirmation;
  public steriles = confirmation;
  public chips: any = confirmation;
  public dewormeds = confirmation;
  public publicationID = '';
  // public datosFormulario = new FormData();
  // public file: File;
  // public imageName: string = null;
  // public imageURL: string = null;
  // public nombreArchivo = '';
  // public image: FormControl;
  // public porcentaje = 0;
  // public images: any = [];

  public editPublication: boolean;
  public files: any = [];
  public originalImages: any = []; // Compare images init on final

  public user: User;
  public isAdmin: boolean = false;
  public isAutor: boolean = false;
  public provinces: string[] = provinces;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private authService: AuthService,
    private publicationService: PublicationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    // Editar o Crear
    this.activatedRoute.params.forEach((params) => (this.publicationID = params['id']));
  }

  async ngOnInit(): Promise<void> {
    // this.route.params.forEach((params) => (publicationID = params['id']));

    // Si vamos a editar una publicación
    this.user = await this.authService.getCurrentUserLogged();
    if (this.publicationID) {
      this.publication = await this.publicationService.getPublicationById(this.publicationID);
      // this.user = await this.authService.getCurrentUserLogged();
      this.isAutor = this.publication.idAutor === this.user.id;
      // this.isAdmin = this.user.role === Role.admin;

      // if (!this.publication) {
      //   this.router.navigate(['publication-not-found']);
      //   return;
      // }

      // if (!this.publication) {
      //   this.router.navigate(['publication-not-found']);
      //   return;
      // } else if (!this.isAutor && !this.isAdmin) {
      //   this.location.back();
      //   console.log('No tienes permisos para editar la publicación!!!'); // Poner un guard para evitar esto
      //   return;
      // }

      this.editPublication = true;
      this.publication.images ??= {};
      const [clone1, clone2] = [
        JSON.parse(JSON.stringify(this.publication.images)),
        JSON.parse(JSON.stringify(this.publication.images)),
      ];
      this.originalImages = this.utilsService.getArrayFromObject(clone1);
      this.files = this.utilsService.getArrayFromObject(clone2);

      console.log('this.files', this.files);
    } else {
      // Si vamos a crear una publicación
      this.publicationID = this.utilsService.generateID();
      this.editPublication = false;
      console.log('Creamos ');
    }

    // Enums del diagrama de clase
    // this.sexs = Object.entries(Sex).map((entry) => {
    //   const [key, value] = entry;
    //   return { key, value };
    // });

    // this.types = Object.entries(Type).map((entry) => {
    //   const [key, value] = entry;
    //   return { key, value };
    // });

    // this.sizes = Object.entries(Size).map((entry) => {
    //   const [key, value] = entry;
    //   return { key, value };
    // });

    this.sexs = Object.values(Sex);
    this.types = Object.values(Type);
    this.sizes = Object.values(Size);

    this.name = new FormControl(this.publication?.name ? this.publication.name : '', [Validators.required]);
    this.description = new FormControl(this.publication?.description ? this.publication.description : '', [
      Validators.required,
      Validators.minLength(100),
    ]);
    this.age = new FormControl(this.publication.age ? this.publication.age : '', [Validators.required]);
    this.size = new FormControl(this.publication.size ? this.publication.size : '', [Validators.required]);
    this.sex = new FormControl(this.publication.sex ? this.publication.sex : '', [Validators.required]);
    this.chip = new FormControl(this.publication.chip ? this.publication.chip : '', [Validators.required]);
    this.type = new FormControl(this.publication.type ? this.publication.type : '', [Validators.required]);
    this.breed = new FormControl(this.publication.breed ? this.publication.breed : '', [Validators.required]);
    this.sterile = new FormControl(this.publication.sterile ? this.publication.sterile : '', [Validators.required]);
    this.vaccinate = new FormControl(this.publication.vaccinate ? this.publication.vaccinate : '', [
      Validators.required,
    ]);
    this.dewormed = new FormControl(this.publication.dewormed ? this.publication.dewormed : '', [Validators.required]);
    this.image = new FormControl('');
    this.province = new FormControl(this.publication.province ? this.publication.province : '', [Validators.required]);
    this.publicationForm = this.createForm();
  }

  public createForm(): FormGroup {
    return this.formBuilder.group({
      name: this.name,
      description: this.description,
      age: this.age,
      size: this.size,
      sex: this.sex,
      chip: this.chip,
      type: this.type,
      breed: this.breed,
      sterile: this.sterile,
      vaccinate: this.vaccinate,
      dewormed: this.dewormed,
      image: this.image,
      province: this.province,
    });
  }

  get f() {
    return this.publicationForm.controls;
  }

  // Añadir o editar una imagen
  public changeImage(event: any) {
    // console.log('---', this.input.nativeElement.value);
    // const filesSelected = event.target.files;
    const filesSelected = event.target.files;
    const sizesArray = this.utilsService.getArrayFromObject(filesSelected);

    // const sizeTotal = sizesArray.reduce((a, b) => ({ size: a.size + b.size })).size;
    const sizeTotal = sizesArray.reduce((acc, obj) => acc + obj.size, 0);
    const maxSizeFile = 1024 * 1024 * 5; // Máximo 5 MB total de subida
    console.log(sizeTotal, maxSizeFile);

    // Validations
    const isSizeValid = maxSizeFile > sizeTotal;
    const isNumFilesValid = filesSelected.length > 0 && filesSelected.length <= 5;
    const isFormatValid = sizesArray.every((file) => /\.(jpg|gif|jpeg|png|webp|svg)$/i.test(file.name));
    console.log(isSizeValid, isNumFilesValid, isFormatValid);
    console.log(filesSelected, sizesArray);

    // const validations = {
    //   size: (s: boolean) => {
    //     if (!s) return 'Ha superado el tamaño máximo permitido (5 MB). ';
    //     return '';
    //   },
    //   maxFiles: (m: boolean) => {
    //     if (!m) return 'Ha superado el máximo de ficheros permitido (Máximo 5 ficheros). ';
    //     return '';
    //   },
    //   format: (f: boolean) => {
    //     if (!f) return 'Formato no permitido. Asegurese de subir sólo imágenes. ';
    //     return '';
    //   },
    //   init: (s: boolean, m: boolean, f: boolean) => {
    //     return validations.size(s) + validations.maxFiles(m) + validations.format(f);
    //   },
    // };

    if (isSizeValid && isNumFilesValid && isFormatValid) {
      // this.input.nativeElement.value = null;
      this.originalImages.map((img: any) => (img.status = 'deleted')); // Al estar editando un objeto que no ha sido copiado
      // console.log('suerteee:', this.originalImages, this.publication.images);

      this.files = [];
      sizesArray.forEach((f) => {
        const id = this.utilsService.generateID();
        const reader = new FileReader();
        reader.onload = (e) => {
          const fileImage = { id: id, src: reader.result, file: f };
          this.files.push(fileImage);
        };
        reader.readAsDataURL(f);
      });

      // for (let i = 0; i < filesSelected.length; i++) {
      //   // Comprobación de que es un formato válido
      //   // if (!/\.(jpg|gif|jpeg|png|webp)$/i.test(filesSelected[i].name)) {
      //   //   this.files = [];
      //   //   console.log('Formato no válido');
      //   //   break;
      //   // } else {
      //   const id = this.utilsService.generateID();
      //   const reader = new FileReader();
      //   reader.onload = (e) => this.files.push({ id: id, src: reader.result, file: filesSelected[i] });
      //   reader.readAsDataURL(filesSelected[i]);
      //   // }
      // }
    } else {
      console.log('Error al subir el fichero !!!');

      // console.info(validations.init(isSizeValid, isNumFilesValid, isFormatValid));
    }
  }

  // public async getCurrentUser(): Promise<User> {
  //   const idUser = await this.authService.getCurrentUserUID();
  //   const user = await this.userService.getUserById(idUser);
  //   return user;
  // }

  public deleteImage(file: any): void {
    if (!this.image.dirty) this.image.markAsDirty();
    if (file.url) {
      this.originalImages.filter((img: any) => img.id === file.id).map((obj: any) => (obj.status = 'deleted'));
      console.log('suerte', this.originalImages);
    }
    // console.log(this.files, this.originalImages);
    this.files = this.files.filter((f: any) => f.id !== file.id);
    if (this.files.length === 0) this.image.setValue('');
  }

  public async onSubmit() {
    if (this.publicationForm.valid) {
      if (this.editPublication) {
        // Comprobamos si existe alguna imagen eliminada
        const isDeleted = this.originalImages.filter((image: any) => image.status === 'deleted');
        if (isDeleted.length > 0) {
          console.log('Existen eliminados: ', isDeleted);
          const deletedPromises = isDeleted.map((image: any) =>
            this.publicationService.deleteCloudStorage(`publications/${this.publicationID}/${image.id}`)
          );
          console.log('deletedPromises:', deletedPromises);

          const deleted = await Promise.all(deletedPromises).catch((e) => this.utilsService.errorHandling(e));
        }
      }

      // // Comprobación si es el administrador!
      // const user = await this.authService.getCurrentUserLogged();

      let images: any = {};
      this.files.forEach((file: any) => {
        images[file.id] = {
          id: file.id,
          url: file?.url,
        };
      });

      // console.log('validacion', this.editPublication, this.isAdmin);

      let publication: Publication = {
        id: this.publicationID,
        idAutor: !this.editPublication ? this.user.id : this.publication.idAutor,
        // idAutor: this.editPublication && this.isAdmin ? this.publication.idAutor : this.user.id,
        name: this.publicationForm.value.name,
        // province: this.editPublication && this.isAdmin ? this.publication.province : this.user.province,
        province: this.publicationForm.value.province,
        description: this.publicationForm.value.description,
        images: images,
        age: this.publicationForm.value.age,
        size: this.publicationForm.value.size,
        sex: this.publicationForm.value.sex,
        chip: this.publicationForm.value.chip,
        type: this.publicationForm.value.type,
        breed: this.publicationForm.value.breed,
        sterile: this.publicationForm.value.sterile,
        vaccinate: this.publicationForm.value.vaccinate,
        dewormed: this.publicationForm.value.dewormed,
        date: this.editPublication ? this.publication.date : null,
        // Campos extras!
        // countFavorites: this.publication.countFavorites ?? 0,
        state: this.publication.state ?? State.available,
        filter: this.publicationForm.value.type + '+' + this.publicationForm.value.province.replaceAll(' ', ''),
      };

      // Subimos las imágenes nuevas
      const isNewImages = this.files.filter((image: any) => image.src);

      if (isNewImages.length > 0) {
        console.log('Existen imágenes para subir');

        const promisesTasks = isNewImages.map((image: any) =>
          this.publicationService.tareaCloudStorage(`publications/${this.publicationID}/${image.id}`, image.file)
        );

        const tasks = await Promise.all(promisesTasks);
        console.log('TASKS', tasks);

        const promisesURLs = isNewImages.map((image: any) =>
          this.publicationService.referenciaCloudStorage(`publications/${this.publicationID}/${image.id}`)
        );

        const urls = await Promise.all(promisesURLs);
        console.log('URLS', urls);

        isNewImages.map((image: any, index: number) => {
          const url = urls[index];
          publication.images[image.id].url = url;
          console.log('percen, url', url);
        });
      }

      if (!publication.date) {
        const servertime = await this.utilsService
          .getServerTimeStamp()
          .catch((e) => this.utilsService.errorHandling(e));
        if (servertime) {
          publication.date = servertime.timestamp;
        }
      }

      if (!this.editPublication) {
        this.publicationService
          .createPublication(publication)
          .then(() => {
            // this.utilsService.successToast('Añadido correctamente');
            this.publicationForm.reset();
            this.location.back();
            console.log('Creado correctamente!');
          })
          .catch((e) => this.utilsService.errorHandling(e));
      } else {
        this.publicationService
          .updatePublication(publication)
          .then(() => {
            // this.utilsService.successToast('Editado correctamente');
            this.publicationForm.reset();
            this.location.back();
            console.log('Editado correctamente!');
          })
          .catch((e) => this.utilsService.errorHandling(e));
      }
    }
  }
}
