# Screenshot per la tesi

Tutte le immagini da 01 a 22 sono in formato 16:9 (1280×720). La n. 23 è verticale perché documenta il menu mobile.

## Sequenza narrativa essenziale consigliata (4 figure)

1. **07-esercizio-da-appendice.png** — *Visualizzazione nell’applicazione di un quesito generato dal motore combinatorio: lo studente sceglie fra quattro opzioni e conferma la risposta.*
2. **09-risposta-errata.png** — *Esito immediato di una risposta errata: l’interfaccia distingue la scelta dello studente dalla soluzione corretta senza alterare il quesito.*
3. **10-diagnosi-deterministica.png** — *Feedback statico prodotto dai dati certificati del generatore: spiegazione della soluzione e diagnosi della specifica misconcezione associata al distrattore scelto.*
4. **11-tutor-socratico.png** — *Intervento del tutor socratico: il modello formula una domanda guida a partire dalla diagnosi deterministica, senza sostituirsi al motore matematico.*

## Raccolta completa

- **01-home.png** — Pagina iniziale e accesso alle funzioni principali.
- **02-menu-principale.png** — Menu generale dell’applicazione.
- **03-simulazioni.png** — Scelta della modalità di simulazione.
- **04-modulo-combinatoria.png** — Accesso al modulo di Combinatoria e probabilità.
- **05-impostazioni-simulazione.png** — Configurazione della sessione di esercitazione.
- **06-impostazioni-feedback.png** — Scelta della modalità di feedback destinata allo studente.
- **07-esercizio-da-appendice.png** — Quesito combinatorio generato e presentato a schermo.
- **08-risposta-selezionata.png** — Stato dell’interfaccia prima della conferma della risposta.
- **09-risposta-errata.png** — Evidenziazione della risposta errata e della soluzione corretta.
- **10-diagnosi-deterministica.png** — Spiegazione e diagnosi legata al distrattore selezionato.
- **11-tutor-socratico.png** — Domanda guida formulata dal tutor socratico.
- **12-esercizio-successivo.png** — Prosecuzione della sessione con un nuovo quesito.
- **13-ripresa-simulazione.png** — Finestra per riprendere una sessione interrotta.
- **14-risultato-finale.png** — Navigazione fra i quesiti durante la sessione.
- **15-progressi-e-sessioni.png** — Pagina dei progressi nello stato iniziale, prima di sessioni completate.
- **16-lezioni.png** — Indice delle lezioni teoriche.
- **17-lezione-strutturata.png** — Esempio di lezione con contenuto matematico strutturato.
- **18-laboratorio-logica.png** — Laboratorio per la costruzione di tavole di verità.
- **19-errore-formula.png** — Esempio di gestione di una formula logica non valida.
- **20-accessibilita.png** — Pannello delle impostazioni di accessibilità.
- **21-accessibilita-personalizzata.png** — Esempio di personalizzazione visiva applicata.
- **22-dati-tutor-raccolta.png** — Configurazione amministrativa del tutor e della raccolta consensuale dei dati.
- **23-menu-mobile.png** — Menu di navigazione su schermo mobile.

## Inserimento LaTeX delle quattro figure principali

```tex
\begin{figure}[htbp]
  \centering
  \includegraphics[width=\textwidth]{07-esercizio-da-appendice.png}
  \caption{Visualizzazione nell'applicazione di un quesito generato dal motore combinatorio.}
  \label{fig:quesito-app}
\end{figure}

\begin{figure}[htbp]
  \centering
  \includegraphics[width=\textwidth]{09-risposta-errata.png}
  \caption{Esito immediato di una risposta errata, con distinzione fra scelta e soluzione corretta.}
  \label{fig:risposta-errata}
\end{figure}

\begin{figure}[htbp]
  \centering
  \includegraphics[width=\textwidth]{10-diagnosi-deterministica.png}
  \caption{Spiegazione deterministica e diagnosi della misconcezione associata al distrattore.}
  \label{fig:diagnosi-deterministica}
\end{figure}

\begin{figure}[htbp]
  \centering
  \includegraphics[width=\textwidth]{11-tutor-socratico.png}
  \caption{Domanda guida del tutor socratico vincolata alla diagnosi deterministica.}
  \label{fig:tutor-socratico}
\end{figure}
```
