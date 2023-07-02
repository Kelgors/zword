import CssBaseline from '@mui/material/CssBaseline';
import { PaletteColorOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { CreditsPage } from './pages/credits/CreditsPage';
import { HomePage } from './pages/home';
import { PlayPage } from './pages/play';

declare module '@mui/material/styles' {
  interface CustomPalette {
    matched: PaletteColorOptions;
    misplaced: PaletteColorOptions;
    incorrect: PaletteColorOptions;
    unmatched: PaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    matched: true;
    misplaced: true;
    incorrect: true;
    unmatched: true;
  }
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          matched: {
            main: '#51D266',
            contrastText: '#FFF'
          },
          misplaced: {
            main: '#B1C615',
            contrastText: '#FFF'
          },
          incorrect: {
            main: '#D92313',
            contrastText: '#FFF'
          },
          unmatched: {
            main: '#555',
            contrastText: '#FFF'
          }
        }
      }),
    [prefersDarkMode]
  );

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={HomePage} />
            <Route path="/play/:locale/:wordSize" Component={PlayPage} />
            <Route path="/credits" Component={CreditsPage} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
