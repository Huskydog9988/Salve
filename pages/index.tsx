import type { NextPage } from "next";
import {useState} from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Image from "next/image";
import ButtonLink from "../src/ButtonLink";
import Salve from "../docs/Salve.svg";
import Grid from "@mui/material/Grid";
import { ThemeProvider, createTheme } from "@mui/material";
import "typeface-alata";
const hellos = [
  { lang: "Latin", phrase: "Salve", pro: "sal-way" },
  { lang: "Afrikanns", phrase: "Hallo", pro: "hal-low" },
  { lang: "Albanian", phrase: "Tjeta", pro: "TYEH-tah" },
  { lang: "Arabic", phrase: "سلام", pro: "salaam" },
  { lang: "Bavarian", phrase: "Servus", pro: "SER-VOOS" },
  { lang: "Belarusian", phrase: "Biтаю", pro: "vee-tie-you" },
  { lang: "Bengali", phrase: "নমস্কার", pro: "nomoshkaar" },
  { lang: "Portuguese", phrase: "Oi", pro: "oi" },
  { lang: "Bulgarian", phrase: "Здрасти", pro: "zdrasti" },
  { lang: "Cambodian", phrase: "ជំរាបសួរ", pro: "sous-dey" },
  { lang: "Cheyenne", phrase: "Haaahe", pro: "ha-AHE" },
  { lang: "Mandarin", phrase: "你好", pro: "ni hao" },
  { lang: "Croatian", phrase: "Bok", pro: "bohk" },
  { lang: "Czech", phrase: "Ahoj", pro: "ahoy" },
  { lang: "Danish", phrase: "Hej", pro: "hai" },
  { lang: "Dutch", phrase: "Hoi", pro: "hoy" },
  { lang: "Estonian", phrase: "Tere", pro: "TEHR-reh" },
  { lang: "Finnish", phrase: "Terve", pro: "TEHR-ve" },
  { lang: "French", phrase: "Salut", pro: "sah-LUU" },
  { lang: "Georgian", phrase: "გამარჯობა", pro: "gah-mahr-joh-bah" },
  { lang: "German", phrase: "Tag", pro: "tahg" },
  { lang: "Greek", phrase: "xαίρε", pro: "chai-ray" },
  { lang: "Haitian", phrase: "Sak Pase", pro: "sak-pase" },
  { lang: "Hebrew", phrase: "שלום", pro: "ma korae" },
  { lang: "Hawaiian", phrase: "Aloha", pro: "ah-loha" },
  { lang: "Hindi", phrase: "नमस्ते", pro: "Nah-mas-teh" },
  { lang: "Hungarian", phrase: "Szia", pro: "SEE-ah" },
  { lang: "Igbo", phrase: "Ndewo", pro: "ne-dewo" },
  { lang: "Irish", phrase: "Dia Dhuit", pro: "DEE-ah GHWIT" },
  { lang: "Italian", phrase: "Buon Giorno", pro: "bwohn JOHR-noh" },
  { lang: "Japanese", phrase: "こんにちは", pro: "kohn-nee-chee-wah" },
  { lang: "Korean", phrase: "안녕하세요", pro: "AHN-young" },
  { lang: "Kurdish", phrase: "Silav", pro: "slaw" },
  { lang: "Latin", phrase: "Salve", pro: "sal-way" },
  { lang: "Polish", phrase: "Cześć", pro: "cheshch" },
  { lang: "Punjabi", phrase: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", pro: "saht sree ah-kahl" },
  { lang: "Russian", phrase: "привет", pro: "pree-VYEHT" },
  { lang: "Spanish", phrase: "Hola", pro: "O-laa" },
  { lang: "Thai", phrase: "สวัสดี ครับ", pro: "sawasdee ka" },
  { lang: "Turkish", phrase: "Selam", pro: "sell um" },
  { lang: "Ukrainian", phrase: "Pryvit", pro: "prih-VEET" },
  { lang: "Vietnamese", phrase: "xin chào", pro: "sin CHOW" },
  
  { lang: "Arabic", phrase: "مرحبا", pro: "marhabaan" },
  { lang: "French", phrase: "Bonjour", pro: "bon-JOUR" },
  { lang: "Lao", phrase: "ສະບາຍດີ", pro: "sa-baai-di" },
  { lang: "English", phrase: "Hi", pro: "hi" },
  { lang: "Basque", phrase: "Kaixo", pro: "kai-show" },
  { lang: "Bosnian", phrase: "Zdravo", pro: "ZDRAH-voh"},
  { lang: "Inuktitut", phrase: "ᐊᐃᓐᖓᐃ", pro: "ainngai"},
  { lang: "Māori", phrase: "tēnā koe", pro: "teh-nah koy"},
  { lang: "Mongolian", phrase: "sain uu", pro: "say-noo"},
  { lang: "Moroccan", phrase: "الو", pro: "alu"},
  { lang: "Navajo", phrase: "yá’át’ééh", pro: "YA-at-eh"},
  { lang: "Odia", phrase: "ନମସ୍କାର", pro: "namaskar"},
  { lang: "Italian", phrase: "Ciao", pro: "chow"},
  { lang: "Yiddish", phrase: "העלא", pro: "hela"},
  { lang: "", phrase: "", pro: ""},
  { lang: "", phrase: "", pro: ""},
  
];

const theme = createTheme({
  typography: {
    fontFamily: ["alata"].join(","),
  },
});
const Home: NextPage = () => {
  const [number, setNumber] = useState(0);
  function randomizeHello() {
    setNumber(Math.floor(Math.random() * (hellos.length)));
  }
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}


      >
        <Grid container height={180}>
          <Grid item xs={1}></Grid>
          <Grid item xs={4}>
            <Image
              alt="👋 Salve"
              src={Salve}
              width={400}
              height={300}
              priority
              onClick={randomizeHello}
            />
          </Grid>
          <Grid item xs={0.2}></Grid>
          <Grid item xs={2}>
            <Box
              sx={{
                lineHeight: 1,
                fontFamily: "alata",
              }}
              component="h1"
            ></Box>
            <ThemeProvider theme={theme}>
              <Box
                sx={{
                  lineHeight: 1.5,
                  fontFamily: "alata",
                  fontSize: 100,
                  width: 600,
                }}
                component="h1"
                color="#73adeb"
              >
                {hellos[number].phrase}
              </Box>
            </ThemeProvider>
          </Grid>
        </Grid>

        <ThemeProvider theme={theme}>
          <Box
            sx={{
              lineHeight: 1,
              fontFamily: "alata",
              fontSize: 30,
            }}
            component="h5"
            color="#73adeb"
          >
            {hellos[number].lang} ({hellos[number].pro})
          </Box>
        </ThemeProvider>
        {/* List of links to each page of the website */}
        <ButtonLink link="/meetings/create">Create a Meeting</ButtonLink>
        <ButtonLink link="/meetings/list">View all Meetings</ButtonLink>
        <ButtonLink link="/users/list">View all Users</ButtonLink>
        <ButtonLink link="/about">About Salve</ButtonLink>
      </Box>
    </Container>
  );
};

export default Home;
