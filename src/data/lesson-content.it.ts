/**
 * Italian lesson bodies, as structured blocks rendered with KaTeX.
 *
 * Lessons 1–6 (Logica matematica) follow the text and the didactic progression
 * of Kevin's Webpage_Logica (lezioni/lezione-1..6.html), the material approved
 * by the supervising professor — https://github.com/KevinUniud/Webpage_Logica
 * Lessons 7–11 (Combinatoria e probabilità) were written for this thesis app
 * against the official CISIA TOLC-S syllabus and Trombetta's manual.
 */

import type { LessonContentMap } from "@/types/lessons";

export const lessonContentIt: LessonContentMap = {
  1: [
    { kind: "h", text: "Dalle frasi alle lettere" },
    {
      kind: "p",
      text: "$P$ e $Q$ sono le nostre affermazioni: possono essere vere o false. Ci aiuteranno ad astrarci dalla lingua e a concentrarci sul solo fatto che una frase sia vera o meno.",
    },
    {
      kind: "example",
      title: "Anna sorride e Anna corre",
      body: [
        "Dalla frase «Anna sorride e Anna corre» possiamo dedurre che Anna stia facendo entrambe le cose contemporaneamente.",
        "Prendiamo ora «Anna sorride» come l'affermazione $P$ e «Anna corre» come l'affermazione $Q$. Deriviamo che se è vero $P$ ed è vero $Q$, allora la loro congiunzione è vera.",
      ],
      tex: "P \\land Q",
    },
    {
      kind: "table",
      caption: "Il vocabolario minimo per tradurre una frase",
      head: ["Parola", "Simbolo"],
      rows: [
        ["allora", "$\\rightarrow$"],
        ["e", "$\\land$"],
        ["o", "$\\lor$"],
        ["non", "$\\neg$"],
      ],
    },
    { kind: "h", text: "Esercizi di traduzione" },
    {
      kind: "p",
      text: "Prova a riscrivere queste frasi usando solo le lettere e i simboli della tabella.",
    },
    {
      kind: "example",
      title: "1. Se Anna sorride allora non corre",
      body: ["Poniamo «Anna sorride» $= P$ e «Anna corre» $= Q$."],
      tex: "P \\rightarrow \\neg Q",
    },
    {
      kind: "example",
      title: "2. Se Anna non nuota allora sorride",
      body: ["Poniamo «Anna nuota» $= N$ e «Anna sorride» $= P$."],
      tex: "\\neg N \\rightarrow P",
    },
    { kind: "h", text: "Astrarsi dal significato" },
    {
      kind: "p",
      text: "Prendiamo la frase «Se Carlo corre allora Carlo nuota»: può sembrare strana nel mondo reale. Se invece la riscriviamo in linguaggio logico, assegnando delle lettere alle varie parti della frase (dove $P$ è «Carlo corre» e $Q$ è «Carlo nuota»), la confusione si perde.",
    },
    { kind: "formula", tex: "P \\rightarrow Q" },
    {
      kind: "callout",
      tone: "note",
      title: "Il punto della lezione",
      body: [
        "Assegnando lettere alle diverse parti della frase originale possiamo astrarci dal significato reale e concentrarci solo sul valore di verità.",
      ],
    },
  ],

  2: [
    { kind: "h", text: "I simboli e il loro significato" },
    {
      kind: "p",
      text: "Impariamo a riconoscere le parti importanti del testo e a sostituirle con i simboli corrispondenti.",
    },
    {
      kind: "table",
      caption: "I connettivi logici",
      head: ["Simbolo", "In italiano"],
      rows: [
        ["$\\rightarrow$", "allora, implica"],
        ["$\\land$", "e"],
        ["$\\lor$", "o"],
        ["$\\neg$", "non, negato"],
      ],
    },
    { kind: "h", text: "Frasi da riscrivere" },
    {
      kind: "example",
      title: "1. (Luca mangia) e (non beve) e (salta) e (ride)",
      body: [
        "Luca mangia $= M$, Luca beve $= B$, Luca salta $= S$, Luca ride $= R$.",
      ],
      tex: "M \\land \\neg B \\land S \\land R",
    },
    {
      kind: "example",
      title: "2. Se [(Laura danza) o (salta e canta)] allora ride",
      body: [
        "Laura danza $= D$, Laura salta $= S$, Laura canta $= C$, Laura ride $= R$.",
      ],
      tex: "(D \\lor (S \\land C)) \\rightarrow R",
    },
    {
      kind: "example",
      title: "3. Se Paolo danza allora [(o non balla) o (non canta e ride e salta)]",
      body: [
        "Paolo danza $= D$, Paolo balla $= B$, Paolo canta $= C$, Paolo ride $= R$, Paolo salta $= S$.",
      ],
      tex: "D \\rightarrow (\\neg B \\lor (\\neg C \\land R \\land S))",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Importante",
      body: [
        "In $P \\rightarrow Q$, la $Q$ può accadere anche da sola; ma se accade $P$ deve seguire $Q$. Quindi se $Q$ non è accaduto, non è accaduto neanche $P$.",
      ],
    },
  ],

  3: [
    { kind: "h", text: "Che cos'è una tabella di verità" },
    {
      kind: "p",
      text: "Una tabella di verità è utile a capire il valore di verità di una frase attraverso tutte le possibili combinazioni di vero e falso delle proposizioni che la compongono. Con $n$ atomi servono $2^n$ righe.",
    },
    {
      kind: "table",
      caption: "La tabella dei connettivi fondamentali",
      head: ["$P$", "$Q$", "$P \\land Q$", "$P \\lor Q$", "$P \\rightarrow Q$", "$\\neg P$"],
      rows: [
        ["F", "F", "F", "F", "V", "V"],
        ["V", "F", "F", "V", "F", "F"],
        ["F", "V", "F", "V", "V", "V"],
        ["V", "V", "V", "V", "V", "F"],
      ],
    },
    {
      kind: "list",
      items: [
        "L'unico caso in cui $P \\land Q$ è vero è se $P$ e $Q$ sono entrambi veri.",
        "L'unico caso in cui $P \\lor Q$ è falso è se $P$ e $Q$ sono entrambi falsi.",
        "L'unico caso in cui $P \\rightarrow Q$ è falso è se $P$ è vera e $Q$ è falsa.",
        "Il simbolo $\\neg$ inverte il valore di verità.",
      ],
    },
    { kind: "h", text: "Precedenza degli operatori" },
    {
      kind: "p",
      text: "Se assegniamo un valore di verità agli atomi possiamo iniziare a fare delle deduzioni. Per ridurre l'uso delle parentesi si introduce il seguente ordine di precedenza:",
    },
    {
      kind: "formula",
      tex: "(\\;)\\quad \\succ \\quad \\neg \\quad \\succ \\quad \\land,\\ \\lor \\quad \\succ \\quad \\rightarrow",
      caption: "Dalla precedenza più alta alla più bassa",
    },
    {
      kind: "p",
      text: "Ad esempio l'espressione $((\\neg(P) \\land Q) \\land R)$ può essere scritta come $\\neg P \\land Q \\land R$ mantenendo invariato il significato, e $P \\land Q \\rightarrow R$ si interpreta correttamente come $(P \\land Q) \\rightarrow R$ anche in assenza di parentesi.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Restano casi ambigui",
      body: [
        "Si prenda l'espressione $P \\land Q \\lor R$: può venire interpretata sia come $(P \\land Q) \\lor R$ sia come $P \\land (Q \\lor R)$. Ci sono quindi casi in cui è necessario usare esplicitamente le parentesi per evitare ambiguità.",
      ],
    },
    { kind: "h", text: "Esercizi di deduzione" },
    {
      kind: "example",
      title: "1. Sapendo che $P$ e $Q$ sono falsi",
      body: [
        "$P \\land Q$ è falsa, perché servono entrambi veri.",
        "$P \\land Q \\rightarrow Q$ è vera: l'antecedente è falso, quindi l'implicazione non può essere falsa.",
      ],
    },
    {
      kind: "example",
      title: "2. Sapendo che $P$ è vero mentre $Q$ è falso",
      body: [
        "$P \\rightarrow Q$ è falsa: è l'unico caso in cui l'implicazione cade.",
        "$Q \\rightarrow P$ è vera, perché l'antecedente $Q$ è falso.",
        "$(P \\rightarrow Q) \\land (Q \\rightarrow P)$ è falsa, perché il primo membro è falso.",
      ],
    },
    {
      kind: "example",
      title: "3. Sapendo che $P$ e $Q$ sono veri e $N$ è falso",
      body: [
        "$Q \\land N$ è falsa.",
        "$P \\lor (Q \\land N)$ è vera, perché basta $P$ vero.",
      ],
    },
    {
      kind: "example",
      title: "4. Sapendo che $P$ è vero mentre $Q$ e $N$ sono falsi",
      body: [
        "Valutiamo $P \\rightarrow \\neg((Q \\land N) \\rightarrow N)$ da dentro verso fuori: $Q \\land N$ è falsa, quindi $(Q \\land N) \\rightarrow N$ è vera, la sua negazione è falsa, e con $P$ vero l'implicazione finale è falsa.",
      ],
    },
    {
      kind: "p",
      text: "La tecnica appena vista — assegnare valori agli atomi e valutare la formula riga per riga — è esattamente quella usata dal generatore di quesiti del modulo di Logica matematica.",
    },
  ],

  4: [
    { kind: "h", text: "Il «se e solo se»" },
    {
      kind: "p",
      text: "Introduciamo ora il «se e solo se» ($\\leftrightarrow$): questo operatore logico deriva dall'unione di due implicazioni in versi opposti.",
    },
    { kind: "formula", tex: "P \\leftrightarrow Q \\;\\equiv\\; (P \\rightarrow Q) \\land (Q \\rightarrow P)" },
    {
      kind: "table",
      caption: "La tabella di verità del bicondizionale",
      head: ["$P$", "$Q$", "$P \\leftrightarrow Q$"],
      rows: [
        ["V", "V", "V"],
        ["V", "F", "F"],
        ["F", "V", "F"],
        ["F", "F", "V"],
      ],
    },
    {
      kind: "p",
      text: "Dalla tabella risulta quindi che entrambe le affermazioni devono avere lo stesso valore di verità affinché la relazione sia vera: sono vere insieme e false insieme.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Importante",
      body: [
        "L'operatore di doppia implicazione $\\leftrightarrow$ ha precedenza inferiore rispetto all'implicazione $\\rightarrow$.",
      ],
    },
    { kind: "h", text: "Negare un bicondizionale" },
    {
      kind: "p",
      text: "Poiché $P \\leftrightarrow Q$ è falsa esattamente quando i due valori differiscono, la sua negazione dice «o una o l'altra, ma non entrambe»:",
    },
    { kind: "formula", tex: "\\neg(P \\leftrightarrow Q) \\;\\equiv\\; (P \\land \\neg Q) \\lor (\\neg P \\land Q)" },
  ],

  5: [
    { kind: "h", text: "Cinque equivalenze da riconoscere" },
    {
      kind: "p",
      text: "Due formule sono equivalenti quando i due membri sono interscambiabili, perché producono gli stessi valori di verità per ogni possibile assegnazione delle variabili.",
    },
    {
      kind: "table",
      caption: "Le equivalenze fondamentali",
      head: ["Formula", "", "Equivalente"],
      rows: [
        ["$P \\rightarrow Q$", "$\\leftrightarrow$", "$\\neg P \\lor Q$"],
        ["$P \\rightarrow Q$", "$\\leftrightarrow$", "$\\neg Q \\rightarrow \\neg P$"],
        ["$P \\lor Q$", "$\\leftrightarrow$", "$\\neg P \\rightarrow Q$"],
        ["$P \\land Q$", "$\\leftrightarrow$", "$\\neg(P \\rightarrow \\neg Q)$"],
        ["$\\neg(P \\rightarrow Q)$", "$\\leftrightarrow$", "$P \\land \\neg Q$"],
      ],
    },
    { kind: "h", text: "Domande svolte" },
    {
      kind: "example",
      title: "1. Quale formula è equivalente a $P \\rightarrow (Q \\lor V)$?",
      body: [
        "Si applica la prima equivalenza trattando $(Q \\lor V)$ come un unico blocco.",
      ],
      tex: "\\neg P \\lor Q \\lor V",
    },
    {
      kind: "example",
      title: "2. «Anna salta e corre»",
      body: [
        "Sapendo che «Anna salta» $= P$ e «Anna corre» $= Q$, la quarta equivalenza dice che affermare $P \\land Q$ equivale a negare che da $P$ segua $\\neg Q$.",
      ],
      tex: "P \\land Q \\;\\leftrightarrow\\; \\neg(P \\rightarrow \\neg Q)",
    },
    {
      kind: "example",
      title: "3. «Se Bob suona il flauto allora balla»",
      body: [
        "Con «Bob suona il flauto» $= P$ e «Bob balla» $= Q$, la contronominale dice la stessa cosa: se Bob non balla, allora non suona il flauto.",
      ],
      tex: "P \\rightarrow Q \\;\\leftrightarrow\\; \\neg Q \\rightarrow \\neg P",
    },
    {
      kind: "example",
      title: "4. «Se Carlo non è felice allora Daniele lo è»",
      body: [
        "Posto $P$ = «Carlo è felice» e $Q$ = «Daniele è felice», la terza equivalenza la riscrive come una disgiunzione: almeno uno dei due è felice.",
      ],
      tex: "\\neg P \\rightarrow Q \\;\\leftrightarrow\\; P \\lor Q",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Attenzione alla «o»",
      body: [
        "La «o» logica non è esclusiva come spesso la intendiamo in linguaggio naturale: permette la verità di entrambe le proposizioni allo stesso tempo.",
        "Si ricorda anche che, come detto nella lezione 2, se $P \\rightarrow Q$ è vera e $Q$ non è vera, allora non è vera neanche $P$.",
      ],
    },
    { kind: "h", text: "Equivalenze su sottoespressioni" },
    {
      kind: "p",
      text: "Nelle equivalenze logiche è possibile considerare anche sottoespressioni più ampie, a condizione che vengano rispettate le parentesi e la precedenza delle operazioni:",
    },
    { kind: "formula", tex: "\\neg(\\neg A \\rightarrow B) \\;\\leftrightarrow\\; \\neg A \\land \\neg B" },
    {
      kind: "p",
      text: "In questo caso l'espressione $\\neg A$ viene trattata come la proposizione $P$ nell'equivalenza generale $\\neg(P \\rightarrow Q) \\leftrightarrow P \\land \\neg Q$.",
    },
  ],

  6: [
    { kind: "h", text: "Proprietà che dipendono da una variabile" },
    {
      kind: "p",
      text: "Si introduce la notazione $P(x)$, che rappresenta una proprietà o proposizione dipendente da una variabile $x$: $P(x)$ è una frase il cui valore di verità dipende dallo specifico valore assegnato a $x$.",
    },
    {
      kind: "table",
      caption: "I due quantificatori",
      head: ["Formula", "Si legge"],
      rows: [
        ["$\\forall x\\, P(x)$", "per ogni $x$ vale $P(x)$"],
        ["$\\exists x\\, P(x)$", "esiste $x$ tale che $P(x)$"],
      ],
    },
    { kind: "h", text: "Negare un quantificatore" },
    {
      kind: "p",
      text: "La comprensione dei quantificatori è intuitiva, ma la loro negazione può essere meno chiara. Valgono queste due regole:",
    },
    { kind: "formula", tex: "\\neg \\forall x\\, P(x) \\;\\leftrightarrow\\; \\exists x\\, \\neg P(x)" },
    { kind: "formula", tex: "\\neg \\exists x\\, P(x) \\;\\leftrightarrow\\; \\forall x\\, \\neg P(x)" },
    {
      kind: "list",
      items: [
        "Per negare che tutti abbiano una certa proprietà, basta che qualcuno non ce l'abbia.",
        "Per negare che esista qualcuno che ha una certa proprietà bisogna dire che nessuno ce l'ha.",
      ],
    },
    { kind: "h", text: "Esercizi svolti" },
    {
      kind: "example",
      title: "«Ogni persona felice ride»",
      body: [
        "Poniamo $x$ = persona generica, $F(x)$ = «$x$ è felice», $R(x)$ = «$x$ ride». La frase si formalizza come $\\forall x\\,(F(x) \\rightarrow R(x))$; negarla significa dire che esiste una persona felice che non ride.",
      ],
      tex: "\\neg \\forall x\\,(F(x) \\rightarrow R(x)) \\;\\leftrightarrow\\; \\exists x\\,(F(x) \\land \\neg R(x))",
    },
    {
      kind: "example",
      title: "«Ogni cane salta o abbaia»",
      body: [
        "Negare questa frase significa dire che esiste un cane che non salta e non abbaia: si scambia il quantificatore e si applica De Morgan alla disgiunzione.",
      ],
      tex: "\\neg \\forall x\\,(S \\lor A) \\;\\leftrightarrow\\; \\exists x\\, \\neg(S \\lor A) \\;\\leftrightarrow\\; \\exists x\\,(\\neg S \\land \\neg A)",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Due frasi che sembrano uguali e non lo sono",
      body: [
        "«Non esiste un cane che salta e abbaia» è $\\forall x\\,\\neg(S \\land A)$, cioè $\\forall x\\,(\\neg S \\lor \\neg A)$: ogni cane rinuncia ad almeno una delle due azioni.",
        "«Ogni cane non salta e non abbaia» è $\\forall x\\,(\\neg S \\land \\neg A)$: nessun cane fa nessuna delle due cose. La seconda è molto più forte della prima.",
      ],
    },
    {
      kind: "p",
      text: "Ora che si hanno le basi si può proseguire con gli esercizi del modulo di Logica matematica.",
    },
  ],

  7: [
    { kind: "h", text: "Il principio moltiplicativo" },
    {
      kind: "p",
      text: "Il principio moltiplicativo è il motore di tutto il calcolo combinatorio: se una scelta si può compiere in $r$ modi e una seconda, indipendente, in $s$ modi, le due scelte insieme si compiono in $r \\cdot s$ modi.",
    },
    { kind: "h", text: "Disposizioni semplici" },
    {
      kind: "p",
      text: "Contano gli ordinamenti di $k$ elementi scelti fra $n$, senza ripetizioni: codici con cifre diverse, classifiche, podi.",
    },
    { kind: "formula", tex: "D_{n,k} = n\\,(n-1)\\cdots(n-k+1) = \\frac{n!}{(n-k)!}" },
    { kind: "h", text: "Disposizioni con ripetizione" },
    {
      kind: "p",
      text: "Contano le sequenze in cui ogni elemento può tornare: lucchetti, targhe, password.",
    },
    { kind: "formula", tex: "D'_{n,k} = n^k" },
    { kind: "h", text: "Permutazioni" },
    {
      kind: "p",
      text: "Sono il caso particolare $k = n$: gli anagrammi di una parola senza lettere doppie.",
    },
    { kind: "formula", tex: "P_n = n!" },
    {
      kind: "p",
      text: "Quando le lettere si ripetono si divide per i fattoriali delle ripetizioni, per non contare più volte lo stesso anagramma:",
    },
    { kind: "formula", tex: "P_n^{(r_1,\\dots,r_m)} = \\frac{n!}{r_1!\\,r_2!\\cdots r_m!}" },
    {
      kind: "callout",
      tone: "note",
      title: "Le due domande da farsi sempre",
      body: ["L'ordine conta?", "Gli elementi si possono ripetere?"],
    },
  ],

  8: [
    { kind: "h", text: "Quando l'ordine non conta" },
    {
      kind: "p",
      text: "Le combinazioni contano i gruppi di $k$ elementi scelti fra $n$ senza ripetizioni e senza incarichi: commissioni, squadre, estrazioni simultanee.",
    },
    { kind: "formula", tex: "C_{n,k} = \\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}" },
    {
      kind: "p",
      text: "Il legame con le disposizioni è immediato: ogni gruppo di $k$ persone corrisponde a $k!$ ordinamenti, che vanno contati una sola volta.",
    },
    { kind: "formula", tex: "\\binom{n}{k} = \\frac{D_{n,k}}{k!}" },
    { kind: "h", text: "Quote su più gruppi" },
    {
      kind: "p",
      text: "Con vincoli su gruppi distinti si moltiplica, perché le scelte sono indipendenti: scegliere $x$ ragazze fra $a$ e $y$ ragazzi fra $b$ vale",
    },
    { kind: "formula", tex: "\\binom{a}{x}\\binom{b}{y}" },
    {
      kind: "callout",
      tone: "warning",
      title: "Gruppi «senza etichetta»",
      body: [
        "Dividere 6 studenti in 3 coppie non è $\\binom{6}{2}\\binom{4}{2}\\binom{2}{2} = 90$: i tre gruppi sono indistinguibili e ogni ripartizione è stata contata $3!$ volte.",
        "Occorre dividere per $k!$, esattamente come nel passaggio dalle disposizioni alle combinazioni: $\\frac{90}{3!} = 15$.",
      ],
    },
    { kind: "h", text: "Applicazioni classiche del test" },
    {
      kind: "list",
      items: [
        "Le diagonali di un poligono di $n$ lati: $\\binom{n}{2} - n$, perché ogni coppia di vertici dà un segmento e si toglie la coppia di lati.",
        "I sottoinsiemi di un insieme di $n$ elementi: $2^n$, perché per ogni elemento si decide se prenderlo.",
        "Il triangolo di Tartaglia, in cui ogni numero è la somma dei due soprastanti e la riga $n$ elenca i coefficienti $\\binom{n}{k}$.",
      ],
    },
  ],

  9: [
    { kind: "h", text: "La definizione classica di Laplace" },
    {
      kind: "p",
      text: "La probabilità di un evento è il rapporto fra i casi favorevoli e i casi possibili, tutti ugualmente probabili.",
    },
    { kind: "formula", tex: "P(A) = \\frac{\\text{casi favorevoli}}{\\text{casi possibili}}" },
    { kind: "h", text: "Unione di eventi" },
    { kind: "p", text: "Eventi incompatibili si sommano:" },
    { kind: "formula", tex: "P(A \\cup B) = P(A) + P(B)" },
    { kind: "p", text: "Se gli eventi sono compatibili, l'intersezione va tolta una volta:" },
    { kind: "formula", tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)" },
    {
      kind: "callout",
      tone: "warning",
      title: "La fonte più frequente dei distrattori",
      body: [
        "Dimenticare di sottrarre l'intersezione produce un risultato errato ma verosimile: è l'errore che i quesiti d'esame preparano più spesso.",
      ],
    },
    { kind: "h", text: "Intersezione e condizionamento" },
    { kind: "p", text: "Eventi indipendenti si moltiplicano:" },
    { kind: "formula", tex: "P(A \\cap B) = P(A)\\,P(B)" },
    {
      kind: "p",
      text: "Se il secondo esperimento dipende dal primo (estrazioni senza reimmissione), serve la probabilità condizionata, con il prodotto a catena $P(A)\\,P(B \\mid A)$:",
    },
    { kind: "formula", tex: "P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}" },
    {
      kind: "callout",
      tone: "note",
      title: "Prima di sommare o moltiplicare",
      body: ["Chiediti sempre: gli eventi si escludono, o possono verificarsi insieme?"],
    },
  ],

  10: [
    { kind: "h", text: "La probabilità totale" },
    {
      kind: "p",
      text: "Quando un esperimento passa per più stadi, l'albero della probabilità organizza il calcolo: si sommano i rami che portano allo stesso esito.",
    },
    {
      kind: "formula",
      tex: "P(D) = P(D \\mid M_1)\\,P(M_1) + P(D \\mid M_2)\\,P(M_2)",
      caption: "Due macchine con quote di produzione e tassi di difetti diversi",
    },
    { kind: "h", text: "Il teorema di Bayes" },
    {
      kind: "p",
      text: "Bayes percorre l'albero in senso inverso: sapendo che il pezzo è difettoso, quanto vale la probabilità che venga dalla prima macchina?",
    },
    { kind: "formula", tex: "P(M_1 \\mid D) = \\frac{P(D \\mid M_1)\\,P(M_1)}{P(D)}" },
    {
      kind: "callout",
      tone: "warning",
      title: "L'errore classico",
      body: [
        "Confondere $P(A \\mid B)$ con $P(B \\mid A)$: si inverte la direzione del condizionamento. È l'inganno che i quesiti tendono a preparare.",
      ],
    },
    { kind: "h", text: "Lo schema di Bernoulli" },
    {
      kind: "p",
      text: "Conta i successi in $n$ prove indipendenti con probabilità $p$, posto $q = 1 - p$:",
    },
    { kind: "formula", tex: "P(k \\text{ successi}) = \\binom{n}{k} p^k q^{\\,n-k}" },
    { kind: "p", text: "Per gli eventi «almeno uno» conviene passare al complementare:" },
    { kind: "formula", tex: "P(\\text{almeno uno}) = 1 - q^{\\,n}" },
    { kind: "h", text: "Il principio dei cassetti" },
    {
      kind: "p",
      text: "Il principio di Dirichlet garantisce la certezza nel caso peggiore: con $m$ colori, per avere sicuramente $k$ pezzi dello stesso colore bastano",
    },
    { kind: "formula", tex: "m\\,(k-1) + 1" },
    {
      kind: "p",
      text: "estrazioni, perché le prime $m\\,(k-1)$ possono distribuire al massimo $k-1$ pezzi per colore.",
    },
  ],

  11: [
    {
      kind: "p",
      text: "Questa lezione raccoglie i quattro schemi che distinguono un quesito impegnativo da uno scolastico, seguendo l'impostazione del manuale di Maurizio Trombetta «Calcolo combinatorio · Teoria e problemi».",
    },
    { kind: "h", text: "1. Combinazioni con ripetizione: «stelle e barre»" },
    {
      kind: "p",
      text: "Distribuire $k$ oggetti identici fra $n$ destinatari distinti equivale ad allineare $k$ stelle e $n-1$ barre separatrici:",
    },
    { kind: "formula", tex: "C'_{n,k} = \\binom{k+n-1}{\\,n-1\\,}" },
    {
      kind: "example",
      title: "Le caramelle ai bambini",
      body: [
        "10 caramelle identiche fra 3 bambini danno $\\binom{12}{2} = 66$ modi.",
        "Se ciascun bambino deve riceverne almeno 2, si consegna prima la quota minima (6 caramelle) e si applica la formula alle 4 rimaste: $\\binom{6}{2} = 15$.",
      ],
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Se le caramelle sono tutte diverse",
      body: [
        "Il modello cambia del tutto: non sono più stelle e barre ma disposizioni con ripetizione, $3^{10} = 59\\,049$.",
      ],
    },
    { kind: "h", text: "2. Permutazioni cicliche" },
    {
      kind: "p",
      text: "Attorno a un tavolo rotondo le sistemazioni che differiscono per una rotazione sono la stessa: si fissa una persona come riferimento e si contano le altre.",
    },
    { kind: "formula", tex: "\\frac{n!}{n} = (n-1)!" },
    {
      kind: "p",
      text: "Se anche il ribaltamento speculare è irrilevante — come su un braccialetto di perline — si divide ancora per 2, ottenendo $\\frac{(n-1)!}{2}$. Con il vincolo «due persone non vicine» si fissa la prima e si escludono per la seconda i due posti adiacenti:",
    },
    { kind: "formula", tex: "(n-3)\\,(n-2)!" },
    { kind: "h", text: "3. Il binomio di Newton" },
    { kind: "p", text: "Lo sviluppo di $(a+b)^n$ ha termine generale" },
    { kind: "formula", tex: "\\binom{n}{k} a^k b^{\\,n-k}" },
    {
      kind: "p",
      text: "Il coefficiente binomiale va sempre moltiplicato per le potenze delle basi. Valgono inoltre:",
    },
    {
      kind: "list",
      items: [
        "la simmetria $\\binom{n}{k} = \\binom{n}{n-k}$;",
        "la regola di Stifel $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$, che costruisce il triangolo di Tartaglia;",
        "la somma di una riga, $\\sum_{k=0}^{n} \\binom{n}{k} = 2^n$.",
      ],
    },
    { kind: "h", text: "4. Il principio di inclusione-esclusione" },
    { kind: "p", text: "Per due insiemi:" },
    { kind: "formula", tex: "|A \\cup B| = |A| + |B| - |A \\cap B|" },
    { kind: "p", text: "Per tre insiemi i segni si alternano:" },
    {
      kind: "formula",
      tex: "|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "L'errore più frequente",
      body: [
        "Dimenticare di ri-aggiungere l'intersezione tripla: quegli elementi sono stati prima contati tre volte e poi sottratti tre volte, quindi spariscono dal conteggio.",
      ],
    },
  ],
};
