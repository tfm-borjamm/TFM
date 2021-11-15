import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publication } from '../../models/publication.model';
import { PublicationService } from '../../services/publication.service';

@Component({
  selector: 'app-publication-details',
  templateUrl: './publication-details.component.html',
  styleUrls: ['./publication-details.component.scss'],
})
export class PublicationDetailsComponent implements OnInit {
  public actualURL: string;

  public phoneNumber: string = '+34615111611';
  public emailPhone: string = 'borjamm@uoc.edu';

  public publication: Publication;
  public id: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private publicationService: PublicationService
  ) {
    this.activatedRoute.params.forEach((params) => {
      this.id = params.id;
    });
  }

  async ngOnInit(): Promise<void> {
    this.actualURL = encodeURI(document.location.href);

    this.publication = await this.publicationService.getPublicationById(this.id ?? '');
    if (!this.publication) {
      this.router.navigate(['no-results']);
      return;
    }
  }

  encode(message: string): string {
    return encodeURI(message);
  }

  copyLinkToClipboard(): void {
    navigator.clipboard.writeText(this.actualURL);
  }

  // Este método tiene pinta de que se irá a utilsService
  // getTranslate(code: string): Promise<string> {
  //   return this.translate
  //     .get(code)
  //     .pipe(take(1))
  //     .toPromise()
  //     .catch((e) => this.utilsService.errorHandling(e));
  // }
}
