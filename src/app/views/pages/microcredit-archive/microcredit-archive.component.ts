import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { tap, takeUntil, finalize } from 'rxjs/operators';

import { OpenDataService } from '../../../core/services/open-data.service';
import { MicrocreditCampaign } from '../../../core/models/microcredit-campaign.model';

@Component({
  selector: 'app-microcredit-archive',
  templateUrl: './microcredit-archive.component.html',
  styleUrls: ['./microcredit-archive.component.scss']
})
export class MicrocreditArchiveComponent implements OnInit {
	p:number = 1;
	loading: boolean = false;
	private unsubscribe: Subject<any>;	
	campaigns: MicrocreditCampaign[];
	
	constructor(
		private cdRef: ChangeDetectorRef,
		private openDataService: OpenDataService,
	) {
		this.unsubscribe = new Subject();
	}

	ngOnInit() {
		this.fetchCampaignsData();
	}
	
	fetchCampaignsData() {
		this.openDataService.readAllPublicMicrocreditCampaigns()
			.pipe(
				tap(
					data => {
						this.campaigns = data;
						console.log(this.campaigns)
					},
					error => {
					}),
				takeUntil(this.unsubscribe),
				finalize(() => {
					this.loading = false;
					this.cdRef.markForCheck();
				})
			)
			.subscribe();
	}
	
	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}
}
