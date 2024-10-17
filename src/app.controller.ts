import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { newReservationDTO } from './newReservation.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }
  
  
  @Get('reservation')
  @Render('reservation')
  getReservation(){
    return{
      errors: [],
      data: {}
    }
  }

  @Post('newReservation')
  newReservation(
    @Body() reservationData: newReservationDTO,
    @Res() response: Response
  ){
    const errors: string[] = [];
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if(!reservationData.date || !reservationData.email || !reservationData.nev || !reservationData.viewers){
      errors.push('Minden mezot kotelezo megadni');
    }
    if (!expression.test(reservationData.email)){
      errors.push('Nem megfelelő email');
    }
    const reservation = {
      nev: reservationData.nev,
      email: reservationData.email,
      date: reservationData.date,
      viewers: reservationData.viewers,
    }
    const currentDate = new Date();
    if (!reservation.date || new Date(reservationData.date) < currentDate){
      errors.push('Érvénytelen dátum')
    }
    
    if (errors.length > 0){
      response.render('reservation', {
        errors,
        data: reservationData
      })
      return;
    }
    
    
    response.redirect(303, '/success');

    return {
      reservation
    }
  }
}
