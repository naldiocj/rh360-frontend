import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { feedService } from './core/feedback.service';
import { IziToastService } from '@core/services/IziToastService.service';

@Component({
  selector: 'app-feedback-chat',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackChatComponent implements OnInit {

  form!:FormGroup;
  isOpen = false;
  feedback:any = '';
  isSubmitting = false;
  isSubmitted = false;

   constructor(
  private fb:FormBuilder,
  private feed:feedService,
  private toast:IziToastService

   ){

   }

  ngOnInit(): void { 

    this.initform();

  }

  openChat(): void {
    this.isOpen = true;
  }

  closeChat(): void {
    this.isOpen = false;
  }

  handleSubmit(): void {
    if (!this.feedback.trim()) return;

    this.isSubmitting = true;

    // Simulate sending feedback to server
    setTimeout(async () => {
      // Reset form and show success
      this.feedback = '';
      this.isSubmitting = false;
      this.isSubmitted = true;

      // Reset success message after 3 seconds
      setTimeout(() => {
        this.isSubmitted = false;
      }, 3000);
    }, 1000);
  }

  handleFeedbackChange(event: any): void {
    this.feedback = event.target.value;
  }


  public initform(){
    this.form = this.fb.group({
      titulo:[],
      descricao:[],
      origem:[],
    })
  }

  informar(){
    this.feed.registar(this.form.value).subscribe({
      next:()=>{
        this.isSubmitted = true;
        this.closeChat();
        this.form.reset();
      },
      error:()=>{
        this.toast.alerta("Houve um erro na parte interno, Não foi possivel enviar o feed");
      }
    })
  }
}
