import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

@Component({
  selector: 'app-footer',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  const currentYear = new Date().getFullYear();

  const siteMap = [
    {
      title: "PARIS",
      links: ["Beaugrenelle", "Champs-Elysées", "La Vilette"]
    },
    {
      title: "LYON",
      links: ["Vaise", "Carré de Soie", "Bellecour"]
    },
    {
      title: "MARSEILLE",
      links: ["Madeline", "Plan de campagne", "La Joliette"]
    },
    {
      title: "NICE",
      links: ["Lingostière", "Masséna", "Gare du Sud"]
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: "#" },
    { icon: <FaTwitter />, url: "#" },
    { icon: <FaInstagram />, url: "#" }
  ];
}
