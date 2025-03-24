import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ConsentService } from '../../common/services/consent.service';

@Component({
  selector: 'app-terms-dialog',
  template: `
    <div role="dialog" aria-labelledby="terms-title" cdkTrapFocus>
      <h2
        mat-dialog-title
        id="terms-title"
        class="gradient-title"
        tabindex="-1"
      >
        Privacy Notice and Consent
      </h2>
      <mat-dialog-content>
        <div class="terms-content">
          <p>
            This privacy information notice ("Privacy Information Notice")
            informs CGI members ("You" and "Your") on how and why Your Personal
            Data is collected & processed as part of the Reward and Recognition
            Program organized by CBPS ("Commercial Business Process Services").
          </p>

          <h3>WHICH PERSONAL DATA DOES CGI PROCESS & FOR WHAT PURPOSES?</h3>
          <p>
            The R&R Tool (Web Version) is a comprehensive Angular-based
            application designed to facilitate employee recognition and reward
            management. To achieve the purpose, CGI will process Your following
            Personal Data:
          </p>
          <ul>
            <li>Username (cn)</li>
            <li>First Name (givenName)</li>
            <li>Last Name (sn)</li>
            <li>Job Title (title)</li>
            <li>Joined Department (memberOf)</li>
            <li>Department (department)</li>
            <li>CGI email (userPrincipalName)</li>
            <li>Manager LDAP username credential (manager)</li>
            <li>CGI Member ID (extensionAttribute2)</li>
          </ul>
          <p>
            <strong>Purpose of Processing:</strong> Your Personal Data is
            collected & processed to provide an intuitive interface for
            submitting reward points, managing approvals, and viewing
            leaderboards.
          </p>

          <h3>
            WHAT IS THE LEGAL BASIS THAT CGI RELIES UPON FOR PROCESSING YOUR
            PERSONAL DATA?
          </h3>
          <p>
            CGI relies on your consent to process your Personal Data and publish
            it internally for the purposes of this event. Further, CGI also
            relies on your consent for publishing your Personal Data externally
            on the platforms mentioned above.
          </p>

          <h3>HOW AND WITH WHOM ARE YOUR PERSONAL DATA SHARED?</h3>
          <p>
            Your personal data as explained above in Section 2, will be
            processed by the CBPS to create a tool that will facilitate employee
            recognition and reward management.
          </p>

          <h3>DATA SECURITY</h3>
          <p>
            CGI applies risk-appropriate technical and organizational security
            measures to protect Your data from unauthorized access, from
            unauthorized modification, from damage and loss, and from misuse.
            Where contracted third-party suppliers provide services to CGI that
            involve processing personal data, they are required by the terms of
            the contract to meet or exceed CGI's own security standards.
          </p>

          <h3>HOW LONG DOES CGI RETAIN YOUR PERSONAL DATA?</h3>
          <p>
            CGI is committed to keep Your Personal Data for no longer than what
            is strictly necessary regarding the Purpose for which Your Personal
            Data is collected and processed. Your data would be deleted/archived
            as per CGI's Records Retention Policy and Records Retention
            Procedures.
          </p>

          <h3>WHAT ARE YOUR RIGHTS IN RELATION TO YOUR PERSONAL DATA?</h3>
          <p>
            Subject to applicable law, You have the right to request access to,
            rectification, erasure, and portability of Your personal data. You
            may also exercise Your right to request restriction of and /or
            object to processing of Your personal data. CGI will take all
            reasonable measures to address Your request to exercise any of these
            rights.
          </p>
          <p>
            When addressing such request, You should also make sure that You
            identify Yourselves expressly by providing copy of a valid CGI
            member ID card and Government issued ID card. CGI will not be able
            to address any requests made without due identification.
          </p>
          <p>
            Subject to the above conditions, CGI will endeavor to address Your
            request in due course and no later than within a month from the
            receipt of Your request.
          </p>
          <p>
            If You wish to exercise these rights and/or obtain all relevant
            information in relation to the processing of Your Personal Data,
            please submit a ticket through the
            <a
              href="https://proactionca.ent.cgi.com/jira/servicedesk/customer/portal/288"
              target="_blank"
              >AM Customer Portal</a
            >. You can freely withdraw Your consent at any time by using the
            contact details mentioned above. In that case, all processing
            operations that were based on Your consent and took place before the
            withdrawal of consent remain valid. Alternatively, for grievances on
            such matters, You may also write to the Data Privacy officer at
            <a href="mailto:dpo.ph@cgi.com">dpo.ph&#64;cgi.com</a>.
          </p>
        </div>
      </mat-dialog-content>
      <form [formGroup]="consentForm">
        <div class="consent-section">
          <mat-checkbox formControlName="dataProcessing" color="primary">
            I consent to the processing of my personal data
          </mat-checkbox>

          <mat-checkbox formControlName="rewardsParticipation" color="primary">
            I consent to participate in the rewards management project
          </mat-checkbox>

          <mat-checkbox formControlName="internalPublication" color="primary">
            I consent to internal publication of my data within CGI
            <div>
              (Rewards and Recognition Emails, All Hands Presentations, etc.)
            </div>
          </mat-checkbox>

          <div class="consent-divider"></div>

          <mat-checkbox
            [checked]="allConsentsChecked"
            (change)="toggleAllConsents($event)"
            color="primary"
            class="accept-all"
          >
            Accept All Consents
          </mat-checkbox>

          <!-- <div class="consent-note" *ngIf="!allConsentsChecked">
            Please accept all consents to proceed
          </div> -->
        </div>
      </form>
      <mat-dialog-actions align="end">
        <button
          mat-button
          mat-dialog-close
          (click)="closeWithoutAccepting()"
          class="bt-close-secondary"
        >
          Close
        </button>
        <button
          mat-button
          mat-dialog-close
          cdkFocusInitial
          (click)="closeDialog()"
          class="bt-accept"
          [disabled]="!allConsentsChecked"
        >
          Accept
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .terms-content {
        max-height: 60vh;
        overflow-y: auto;
        padding: 0 20px;
        color: black;
        font-size: 14px;
        line-height: 1.6;
      }

      h3 {
        margin-top: 20px;
        color: #5236ab;
        font-weight: 500;
        font-size: 16px;
      }

      p {
        margin-bottom: 16px;
      }

      ul {
        margin: 16px 0;
        padding-left: 20px;
      }

      li {
        margin-bottom: 8px;
      }

      strong {
        color: #5236ab;
      }

      .gradient-title {
        background: linear-gradient(
          to right,
          #e31937 0%,
          #a82465 50%,
          #5236ab 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        color: transparent;
        font-weight: bold;
        outline: none;
        font-size: 22px;
        margin-bottom: 20px;
      }

      .bt-close {
        background-color: #5236ab;
        color: white;
      }

      :host {
        display: block;
      }

      mat-dialog-content {
        max-height: 70vh;
      }

      .consent-section {
        margin: 20px;
        padding: 20px;
        text-align: left;
        background-color: #f8f8f8;
        border-radius: 4px;
        border: 1px solid #e0e0e0;

        h3 {
          margin-top: 0;
          margin-bottom: 16px;
          color: #5236ab;
          font-weight: 500;
          font-size: 16px;
        }

        mat-checkbox {
          display: block;
          margin: 16px 0;
          padding: 4px 0;
        }
      }

      .consent-note {
        color: #f44336;
        font-size: 12px;
        margin-top: 12px;
        padding: 8px;
        background-color: rgba(244, 67, 54, 0.1);
        border-radius: 4px;
      }

      mat-dialog-actions {
        padding: 16px;
        margin-bottom: 0;
        gap: 8px;
      }

      .bt-close-secondary {
        margin-right: 8px;
        color: #666;
      }

      .bt-accept {
        background-color: #5236ab;
        color: white;

        &:disabled {
          background-color: rgba(82, 54, 171, 0.5);
          color: rgba(255, 255, 255, 0.7);
          cursor: not-allowed;
        }
      }

      .accept-all {
        margin-bottom: 8px !important;
        font-weight: 500;
      }

      .consent-divider {
        border-top: 1px solid #e0e0e0;
        margin: 12px 0;
      }

      .consent-section mat-checkbox {
        display: block;
        margin: 16px 0;
        padding: 4px 0;
      }
    `,
  ],
})
export class TermsDialogComponent implements OnInit {
  consentForm: FormGroup;
  allConsentsChecked = false;

  constructor(
    public dialogRef: MatDialogRef<TermsDialogComponent>,
    private fb: FormBuilder,
    private consentService: ConsentService
  ) {
    this.consentForm = this.fb.group({
      internalPublication: [false],
      dataProcessing: [false],
      rewardsParticipation: [false],
    });

    // Watch for changes in consent checkboxes
    const consentControls = [
      'internalPublication',
      'dataProcessing',
      'rewardsParticipation',
    ];
    consentControls.forEach((control) => {
      this.consentForm.get(control)?.valueChanges.subscribe(() => {
        this.updateConsentsState();
      });
    });
  }

  ngOnInit() {
    this.dialogRef.disableClose = true;
  }

  toggleAllConsents(event: MatCheckboxChange): void {
    const value = event.checked;
    const controls = [
      'internalPublication',
      'dataProcessing',
      'rewardsParticipation',
    ];

    controls.forEach((control) => {
      this.consentForm.get(control)?.setValue(value);
    });
  }

  updateConsentsState(): void {
    this.allConsentsChecked = [
      'internalPublication',
      'dataProcessing',
      'rewardsParticipation',
    ].every((control) => this.consentForm.get(control)?.value === true);
  }

  closeWithoutAccepting(): void {
    this.dialogRef.close(false);
  }

  closeDialog(): void {
    if (this.allConsentsChecked) {
      // Store consents in the service before closing
      this.consentService.setConsents({
        internal_publication_consent: this.consentForm.get(
          'internalPublication'
        )?.value,
        personal_data_consent: this.consentForm.get('dataProcessing')?.value,
        rewards_management_consent: this.consentForm.get('rewardsParticipation')
          ?.value,
      });
      this.dialogRef.close(true);
    }
  }
}
