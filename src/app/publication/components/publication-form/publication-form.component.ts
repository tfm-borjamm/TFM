import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Publication } from '../../../shared/models/publication.model';
import { PublicationService } from '../../../shared/services/publication.service';
import { age } from 'src/app/publication/helpers/age';
import { confirm, confirmWithUnknow } from 'src/app/publication/helpers/confirmation';
import { UserService } from 'src/app/shared/services/user.service';
import { Location, TitleCasePipe } from '@angular/common';
import { Sex } from '../../../shared/enums/sex.enum';
import { Size } from '../../../shared/enums/size.enum';
import { Type } from '../../../shared/enums/type.enum';
import { PublicationState } from '../../../shared/enums/publication-state';
import { User } from 'src/app/shared/models/user.model';
import { provinces } from 'src/app/shared/helpers/provinces';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { CapitalizePipe } from 'src/app/shared/pipes/capitalize.pipe';

@Component({
  selector: 'app-publication-form',
  templateUrl: './publication-form.component.html',
  styleUrls: ['./publication-form.component.scss'],
})
export class PublicationFormComponent implements OnInit {
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
  public shipping: FormControl;
  public sexs: any;
  public types: any;
  public sizes: any;
  public ages = age;
  public vaccinates = confirmWithUnknow;
  public steriles = confirm;
  public chips: any = confirm;
  public shippings: any = confirm;
  public dewormeds = confirm;
  public publicationID = '';
  public editPublication: boolean;
  public files: any = [];
  public originalImages: any = []; // Compare images init on final
  public user: User;
  public isAdmin: boolean = false;
  public isAuthor: boolean = false;
  public provinces: string[] = provinces;
  public btnSubmitted: boolean;
  public publicationParam: Publication;

  constructor(
    private formBuilder: FormBuilder,
    private utilsService: UtilsService,
    private authService: AuthService,
    private publicationService: PublicationService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService,
    private titleCasePipe: TitleCasePipe,
    private capitalizePipe: CapitalizePipe
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authService.getCurrentUserLogged();
    this.publicationParam = this.activatedRoute.snapshot.data.publication;

    if (this.publicationParam) {
      this.publication = this.publicationParam;
      this.publicationID = this.publication.id;
      this.isAuthor = this.publication.idAuthor === this.user.id;
      this.editPublication = true;
      this.publication.images ??= {};
      const [clone1, clone2] = [
        JSON.parse(JSON.stringify(this.publication.images)),
        JSON.parse(JSON.stringify(this.publication.images)),
      ];
      this.originalImages = this.utilsService.getArrayFromObject(clone1);
      this.files = this.utilsService.getArrayFromObject(clone2);
    } else {
      this.publicationID = this.utilsService.generateID();
      this.editPublication = false;
    }

    this.sexs = Object.values(Sex);
    this.types = Object.values(Type);
    this.sizes = Object.values(Size);

    this.name = new FormControl(this.publication?.name ? this.titleCasePipe.transform(this.publication.name) : '', [
      Validators.required,
    ]);
    this.description = new FormControl(
      this.publication?.description ? this.capitalizePipe.transform(this.publication.description) : '',
      [Validators.required, Validators.minLength(50), Validators.maxLength(600)]
    );
    this.age = new FormControl(this.publication.age ? this.publication.age : '', [Validators.required]);
    this.size = new FormControl(this.publication.size ? this.publication.size : '', [Validators.required]);
    this.sex = new FormControl(this.publication.sex ? this.publication.sex : '', [Validators.required]);
    this.chip = new FormControl(this.publication.chip ? this.publication.chip : '', [Validators.required]);
    this.type = new FormControl(this.publication.type ? this.publication.type : '', [Validators.required]);
    this.breed = new FormControl(this.publication.breed ? this.capitalizePipe.transform(this.publication.breed) : '', [
      Validators.required,
    ]);
    this.sterile = new FormControl(this.publication.sterile ? this.publication.sterile : '', [Validators.required]);
    this.shipping = new FormControl(this.publication.shipping ? this.publication.shipping : '', [Validators.required]);
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
      shipping: this.shipping,
    });
  }

  get f() {
    return this.publicationForm.controls;
  }

  // Añadir o editar una imagen
  public changeImage(event: any) {
    const filesSelected = event.target.files;
    const sizesArray = this.utilsService.getArrayFromObject(filesSelected);
    const sizeTotal = sizesArray.reduce((acc, obj) => acc + obj.size, 0);
    const maxSizeFile = 1024 * 1024 * 5; // Máximo 5 MB total de subida

    // Validations
    const isSizeValid = maxSizeFile > sizeTotal;
    const isNumFilesValid = filesSelected.length > 0 && filesSelected.length <= 5;
    const isFormatValid = sizesArray.every((file) => /\.(jpg|gif|jpeg|png|webp|svg)$/i.test(file.name));

    if (isSizeValid && isNumFilesValid && isFormatValid) {
      this.originalImages.map((img: any) => (img.status = 'deleted'));
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
    } else {
      // Se pueden subir como máximo 5 imágenes que no superen los 5 MB
      this.notificationService.errorNotification('errors.upload_images');
    }
  }

  public deleteImage(file: any): void {
    if (!this.image.dirty) this.image.markAsDirty();
    if (file.url) {
      this.originalImages.filter((img: any) => img.id === file.id).map((obj: any) => (obj.status = 'deleted'));
    }
    this.files = this.files.filter((f: any) => f.id !== file.id);
    if (this.files.length === 0) this.image.setValue('');
  }

  public async onSubmit() {
    if (this.publicationForm.valid) {
      this.btnSubmitted = true;
      if (this.editPublication) {
        // Comprobamos si existe alguna imagen eliminada
        const isDeleted = this.originalImages.filter((image: any) => image.status === 'deleted');
        if (isDeleted.length > 0) {
          const deletedPromises = isDeleted.map((image: any) =>
            this.publicationService.deleteCloudStorage(`publications/${this.publicationID}/${image.id}`)
          );

          const deleted = await Promise.all(deletedPromises).catch((e) => this.utilsService.errorHandling(e));
        }
      }

      let images: any = {};
      this.files.forEach((file: any) => {
        images[file.id] = {
          id: file.id,
          url: file?.url,
        };
      });

      let publication: Publication = {
        id: this.publicationID,
        idAuthor: !this.editPublication ? this.user.id : this.publication.idAuthor,
        name: this.publicationForm.value.name.toLowerCase(),
        province: this.publicationForm.value.province,
        description: this.publicationForm.value.description,
        images: images,
        age: this.publicationForm.value.age,
        size: this.publicationForm.value.size,
        sex: this.publicationForm.value.sex,
        chip: this.publicationForm.value.chip,
        type: this.publicationForm.value.type,
        breed: this.publicationForm.value.breed.toLowerCase(),
        sterile: this.publicationForm.value.sterile,
        vaccinate: this.publicationForm.value.vaccinate,
        dewormed: this.publicationForm.value.dewormed,
        shipping: this.publicationForm.value.shipping,
        date: this.editPublication ? this.publication.date : null,
        state: this.publication.state ?? PublicationState.available,
        filter: this.publicationForm.value.type + '+' + this.publicationForm.value.province.replaceAll(' ', ''),
      };

      // Subimos las imágenes nuevas
      const isNewImages = this.files.filter((image: any) => image.src);

      if (isNewImages.length > 0) {
        const promisesTasks = isNewImages.map((image: any) =>
          this.publicationService.tareaCloudStorage(`publications/${this.publicationID}/${image.id}`, image.file)
        );
        const tasks = await Promise.all(promisesTasks);
        const promisesURLs = isNewImages.map((image: any) =>
          this.publicationService.referenciaCloudStorage(`publications/${this.publicationID}/${image.id}`)
        );
        const urls = await Promise.all(promisesURLs);
        isNewImages.map((image: any, index: number) => {
          const url = urls[index];
          publication.images[image.id].url = url;
        });
      }

      if (!publication.date) {
        const servertime = await this.utilsService.getServerTimeStamp().catch((e) => {
          this.btnSubmitted = false;
          this.utilsService.errorHandling(e);
        });
        if (servertime) {
          publication.date = servertime.timestamp;
        }
      }

      if (!this.editPublication) {
        this.publicationService
          .createPublication(publication)
          .then(() => {
            this.location.back();
            this.notificationService.successNotification('success.publication_created');
          })
          .catch((e) => {
            this.btnSubmitted = false;
            this.utilsService.errorHandling(e);
          });
      } else {
        this.publicationService
          .updatePublication(publication)
          .then(() => {
            this.location.back();
            this.notificationService.successNotification('success.publication_updated');
          })
          .catch((e) => {
            this.btnSubmitted = false;
            this.utilsService.errorHandling(e);
          });
      }
    }
  }
}
