import { Component, Input } from '@angular/core';
import {  NgOptimizedImage } from '@angular/common'; 
import { ImageConfig } from '../../interfaces/image-config';
@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [],
  templateUrl: './optimized-image.component.html',
  styleUrl: './optimized-image.component.sass'
})

export class OptimizedImageComponent {
  @Input() config!: ImageConfig;
  handleError(event: any): void {
    event.target.style.display = 'none';
  }
}
