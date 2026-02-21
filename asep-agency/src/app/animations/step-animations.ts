import { trigger, transition, style, animate, query, group } from '@angular/animations';

export const stepTransition = trigger('stepTransition', [
  transition(':increment', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(100%)', opacity: 0 })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(-100%)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0)', opacity: 1 }))
      ], { optional: true })
    ])
  ]),
  transition(':decrement', [
    style({ position: 'relative', overflow: 'hidden' }),
    query(':enter, :leave', [
      style({ position: 'absolute', top: 0, left: 0, width: '100%' })
    ], { optional: true }),
    query(':enter', [
      style({ transform: 'translateX(-100%)', opacity: 0 })
    ], { optional: true }),
    group([
      query(':leave', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(100%)', opacity: 0 }))
      ], { optional: true }),
      query(':enter', [
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ transform: 'translateX(0)', opacity: 1 }))
      ], { optional: true })
    ])
  ])
]);

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('500ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

