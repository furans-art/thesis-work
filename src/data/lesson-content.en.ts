/**
 * English lesson bodies, as structured blocks rendered with KaTeX.
 * Faithful translations of the Italian originals (see lesson-content.it.ts).
 */

import type { LessonContentMap } from "@/types/lessons";

export const lessonContentEn: LessonContentMap = {
  1: [
    { kind: "h", text: "From sentences to letters" },
    {
      kind: "p",
      text: "$P$ and $Q$ are our statements: they can be true or false. They let us step away from the language and focus only on whether a sentence holds.",
    },
    {
      kind: "example",
      title: "Anna smiles and Anna runs",
      body: [
        "From «Anna smiles and Anna runs» we can infer that Anna is doing both things at the same time.",
        "Now take «Anna smiles» as statement $P$ and «Anna runs» as statement $Q$. If $P$ is true and $Q$ is true, then their conjunction is true.",
      ],
      tex: "P \\land Q",
    },
    {
      kind: "table",
      caption: "The minimal vocabulary for translating a sentence",
      head: ["Word", "Symbol"],
      rows: [
        ["then", "$\\rightarrow$"],
        ["and", "$\\land$"],
        ["or", "$\\lor$"],
        ["not", "$\\neg$"],
      ],
    },
    { kind: "h", text: "Translation exercises" },
    {
      kind: "p",
      text: "Try rewriting these sentences using only the letters and the symbols in the table.",
    },
    {
      kind: "example",
      title: "1. If Anna smiles then she does not run",
      body: ["Let «Anna smiles» $= P$ and «Anna runs» $= Q$."],
      tex: "P \\rightarrow \\neg Q",
    },
    {
      kind: "example",
      title: "2. If Anna does not swim then she smiles",
      body: ["Let «Anna swims» $= N$ and «Anna smiles» $= P$."],
      tex: "\\neg N \\rightarrow P",
    },
    { kind: "h", text: "Abstracting away from meaning" },
    {
      kind: "p",
      text: "Take «If Carlo runs then Carlo swims»: it may sound odd in the real world. Rewritten in logical language, assigning letters to the parts of the sentence (where $P$ is «Carlo runs» and $Q$ is «Carlo swims»), the confusion disappears.",
    },
    { kind: "formula", tex: "P \\rightarrow Q" },
    {
      kind: "callout",
      tone: "note",
      title: "The point of this lesson",
      body: [
        "By assigning letters to the parts of the original sentence we can abstract away from real meaning and focus only on truth values.",
      ],
    },
  ],

  2: [
    { kind: "h", text: "The symbols and their meaning" },
    {
      kind: "p",
      text: "Let us learn to spot the meaningful parts of a text and replace them with the matching symbols.",
    },
    {
      kind: "table",
      caption: "The logical connectives",
      head: ["Symbol", "In English"],
      rows: [
        ["$\\rightarrow$", "then, implies"],
        ["$\\land$", "and"],
        ["$\\lor$", "or"],
        ["$\\neg$", "not"],
      ],
    },
    { kind: "h", text: "Sentences to rewrite" },
    {
      kind: "example",
      title: "1. (Luca eats) and (does not drink) and (jumps) and (laughs)",
      body: ["Luca eats $= M$, Luca drinks $= B$, Luca jumps $= S$, Luca laughs $= R$."],
      tex: "M \\land \\neg B \\land S \\land R",
    },
    {
      kind: "example",
      title: "2. If [(Laura dances) or (jumps and sings)] then she laughs",
      body: ["Laura dances $= D$, Laura jumps $= S$, Laura sings $= C$, Laura laughs $= R$."],
      tex: "(D \\lor (S \\land C)) \\rightarrow R",
    },
    {
      kind: "example",
      title: "3. If Paolo dances then [(either he does not waltz) or (does not sing and laughs and jumps)]",
      body: [
        "Paolo dances $= D$, Paolo waltzes $= B$, Paolo sings $= C$, Paolo laughs $= R$, Paolo jumps $= S$.",
      ],
      tex: "D \\rightarrow (\\neg B \\lor (\\neg C \\land R \\land S))",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Important",
      body: [
        "In $P \\rightarrow Q$, $Q$ may also happen on its own; but if $P$ happens then $Q$ must follow. So if $Q$ did not happen, $P$ did not happen either.",
      ],
    },
  ],

  3: [
    { kind: "h", text: "What a truth table is" },
    {
      kind: "p",
      text: "A truth table shows the truth value of a sentence across every possible combination of true and false for the propositions it is built from. With $n$ atoms you need $2^n$ rows.",
    },
    {
      kind: "table",
      caption: "The table of the basic connectives",
      head: ["$P$", "$Q$", "$P \\land Q$", "$P \\lor Q$", "$P \\rightarrow Q$", "$\\neg P$"],
      rows: [
        ["F", "F", "F", "F", "T", "T"],
        ["T", "F", "F", "T", "F", "F"],
        ["F", "T", "F", "T", "T", "T"],
        ["T", "T", "T", "T", "T", "F"],
      ],
    },
    {
      kind: "list",
      items: [
        "$P \\land Q$ is true only when $P$ and $Q$ are both true.",
        "$P \\lor Q$ is false only when $P$ and $Q$ are both false.",
        "$P \\rightarrow Q$ is false only when $P$ is true and $Q$ is false.",
        "The symbol $\\neg$ flips the truth value.",
      ],
    },
    { kind: "h", text: "Operator precedence" },
    {
      kind: "p",
      text: "Once truth values are assigned to the atoms we can start deducing. To reduce the number of brackets, this precedence order is introduced:",
    },
    {
      kind: "formula",
      tex: "(\\;)\\quad \\succ \\quad \\neg \\quad \\succ \\quad \\land,\\ \\lor \\quad \\succ \\quad \\rightarrow",
      caption: "From highest to lowest precedence",
    },
    {
      kind: "p",
      text: "For instance $((\\neg(P) \\land Q) \\land R)$ can be written as $\\neg P \\land Q \\land R$ with the same meaning, and $P \\land Q \\rightarrow R$ correctly reads as $(P \\land Q) \\rightarrow R$ even without brackets.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Ambiguous cases remain",
      body: [
        "Take $P \\land Q \\lor R$: it can be read both as $(P \\land Q) \\lor R$ and as $P \\land (Q \\lor R)$. Some cases still require explicit brackets to avoid ambiguity.",
      ],
    },
    { kind: "h", text: "Worked deductions" },
    {
      kind: "example",
      title: "1. Given that $P$ and $Q$ are false",
      body: [
        "$P \\land Q$ is false, since both must be true.",
        "$P \\land Q \\rightarrow Q$ is true: the antecedent is false, so the implication cannot fail.",
      ],
    },
    {
      kind: "example",
      title: "2. Given that $P$ is true and $Q$ is false",
      body: [
        "$P \\rightarrow Q$ is false: this is the only case where implication fails.",
        "$Q \\rightarrow P$ is true, because the antecedent $Q$ is false.",
        "$(P \\rightarrow Q) \\land (Q \\rightarrow P)$ is false, because the first part is false.",
      ],
    },
    {
      kind: "example",
      title: "3. Given that $P$ and $Q$ are true and $N$ is false",
      body: ["$Q \\land N$ is false.", "$P \\lor (Q \\land N)$ is true, since $P$ alone suffices."],
    },
    {
      kind: "example",
      title: "4. Given that $P$ is true while $Q$ and $N$ are false",
      body: [
        "Evaluate $P \\rightarrow \\neg((Q \\land N) \\rightarrow N)$ from the inside out: $Q \\land N$ is false, so $(Q \\land N) \\rightarrow N$ is true, its negation is false, and with $P$ true the outer implication is false.",
      ],
    },
    {
      kind: "p",
      text: "The technique just used — assigning values to the atoms and evaluating the formula row by row — is exactly the one used by the question generator of the Mathematical logic module.",
    },
  ],

  4: [
    { kind: "h", text: "The biconditional" },
    {
      kind: "p",
      text: "We now introduce «if and only if» ($\\leftrightarrow$): this connective comes from joining two implications running in opposite directions.",
    },
    { kind: "formula", tex: "P \\leftrightarrow Q \\;\\equiv\\; (P \\rightarrow Q) \\land (Q \\rightarrow P)" },
    {
      kind: "table",
      caption: "Truth table of the biconditional",
      head: ["$P$", "$Q$", "$P \\leftrightarrow Q$"],
      rows: [
        ["T", "T", "T"],
        ["T", "F", "F"],
        ["F", "T", "F"],
        ["F", "F", "T"],
      ],
    },
    {
      kind: "p",
      text: "The table shows that both statements must have the same truth value for the relation to hold: they are true together and false together.",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Important",
      body: [
        "The biconditional $\\leftrightarrow$ has lower precedence than the implication $\\rightarrow$.",
      ],
    },
    { kind: "h", text: "Negating a biconditional" },
    {
      kind: "p",
      text: "Since $P \\leftrightarrow Q$ is false exactly when the two values differ, its negation says «one or the other, but not both»:",
    },
    {
      kind: "formula",
      tex: "\\neg(P \\leftrightarrow Q) \\;\\equiv\\; (P \\land \\neg Q) \\lor (\\neg P \\land Q)",
    },
  ],

  5: [
    { kind: "h", text: "Five equivalences to recognise" },
    {
      kind: "p",
      text: "Two formulas are equivalent when the two sides are interchangeable, because they produce the same truth values for every possible assignment of the variables.",
    },
    {
      kind: "table",
      caption: "The fundamental equivalences",
      head: ["Formula", "", "Equivalent to"],
      rows: [
        ["$P \\rightarrow Q$", "$\\leftrightarrow$", "$\\neg P \\lor Q$"],
        ["$P \\rightarrow Q$", "$\\leftrightarrow$", "$\\neg Q \\rightarrow \\neg P$"],
        ["$P \\lor Q$", "$\\leftrightarrow$", "$\\neg P \\rightarrow Q$"],
        ["$P \\land Q$", "$\\leftrightarrow$", "$\\neg(P \\rightarrow \\neg Q)$"],
        ["$\\neg(P \\rightarrow Q)$", "$\\leftrightarrow$", "$P \\land \\neg Q$"],
      ],
    },
    { kind: "h", text: "Worked questions" },
    {
      kind: "example",
      title: "1. Which formula is equivalent to $P \\rightarrow (Q \\lor V)$?",
      body: ["Apply the first equivalence, treating $(Q \\lor V)$ as a single block."],
      tex: "\\neg P \\lor Q \\lor V",
    },
    {
      kind: "example",
      title: "2. «Anna jumps and runs»",
      body: [
        "With «Anna jumps» $= P$ and «Anna runs» $= Q$, the fourth equivalence says that asserting $P \\land Q$ is the same as denying that $\\neg Q$ follows from $P$.",
      ],
      tex: "P \\land Q \\;\\leftrightarrow\\; \\neg(P \\rightarrow \\neg Q)",
    },
    {
      kind: "example",
      title: "3. «If Bob plays the flute then he dances»",
      body: [
        "With «Bob plays the flute» $= P$ and «Bob dances» $= Q$, the contrapositive says the very same thing: if Bob does not dance, he does not play the flute.",
      ],
      tex: "P \\rightarrow Q \\;\\leftrightarrow\\; \\neg Q \\rightarrow \\neg P",
    },
    {
      kind: "example",
      title: "4. «If Carlo is not happy then Daniele is»",
      body: [
        "Let $P$ = «Carlo is happy» and $Q$ = «Daniele is happy»: the third equivalence rewrites it as a disjunction — at least one of the two is happy.",
      ],
      tex: "\\neg P \\rightarrow Q \\;\\leftrightarrow\\; P \\lor Q",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Mind the «or»",
      body: [
        "Logical «or» is not exclusive, as we often read it in natural language: it allows both propositions to be true at the same time.",
        "Remember too, as stated in lesson 2, that if $P \\rightarrow Q$ is true and $Q$ is not true, then $P$ is not true either.",
      ],
    },
    { kind: "h", text: "Equivalences on subexpressions" },
    {
      kind: "p",
      text: "Logical equivalences also apply to wider subexpressions, as long as brackets and operator precedence are respected:",
    },
    { kind: "formula", tex: "\\neg(\\neg A \\rightarrow B) \\;\\leftrightarrow\\; \\neg A \\land \\neg B" },
    {
      kind: "p",
      text: "Here $\\neg A$ plays the role of proposition $P$ in the general equivalence $\\neg(P \\rightarrow Q) \\leftrightarrow P \\land \\neg Q$.",
    },
  ],

  6: [
    { kind: "h", text: "Properties that depend on a variable" },
    {
      kind: "p",
      text: "We introduce the notation $P(x)$, a property or proposition depending on a variable $x$: $P(x)$ is a sentence whose truth value depends on the specific value assigned to $x$.",
    },
    {
      kind: "table",
      caption: "The two quantifiers",
      head: ["Formula", "Reads as"],
      rows: [
        ["$\\forall x\\, P(x)$", "for every $x$, $P(x)$ holds"],
        ["$\\exists x\\, P(x)$", "there exists an $x$ such that $P(x)$"],
      ],
    },
    { kind: "h", text: "Negating a quantifier" },
    {
      kind: "p",
      text: "Quantifiers are intuitive to read, but their negation is less obvious. Two rules cover it:",
    },
    { kind: "formula", tex: "\\neg \\forall x\\, P(x) \\;\\leftrightarrow\\; \\exists x\\, \\neg P(x)" },
    { kind: "formula", tex: "\\neg \\exists x\\, P(x) \\;\\leftrightarrow\\; \\forall x\\, \\neg P(x)" },
    {
      kind: "list",
      items: [
        "To deny that everyone has a property, it is enough that someone does not have it.",
        "To deny that someone has a property, you must say that nobody has it.",
      ],
    },
    { kind: "h", text: "Worked exercises" },
    {
      kind: "example",
      title: "«Every happy person laughs»",
      body: [
        "Let $x$ be a generic person, $F(x)$ = «$x$ is happy», $R(x)$ = «$x$ laughs». The sentence becomes $\\forall x\\,(F(x) \\rightarrow R(x))$; denying it means saying that there is a happy person who does not laugh.",
      ],
      tex: "\\neg \\forall x\\,(F(x) \\rightarrow R(x)) \\;\\leftrightarrow\\; \\exists x\\,(F(x) \\land \\neg R(x))",
    },
    {
      kind: "example",
      title: "«Every dog jumps or barks»",
      body: [
        "Denying this means saying that there is a dog that neither jumps nor barks: swap the quantifier and apply De Morgan to the disjunction.",
      ],
      tex: "\\neg \\forall x\\,(S \\lor A) \\;\\leftrightarrow\\; \\exists x\\, \\neg(S \\lor A) \\;\\leftrightarrow\\; \\exists x\\,(\\neg S \\land \\neg A)",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "Two sentences that look alike and are not",
      body: [
        "«There is no dog that jumps and barks» is $\\forall x\\,\\neg(S \\land A)$, i.e. $\\forall x\\,(\\neg S \\lor \\neg A)$: every dog gives up at least one of the two actions.",
        "«Every dog neither jumps nor barks» is $\\forall x\\,(\\neg S \\land \\neg A)$: no dog does either. The second is far stronger than the first.",
      ],
    },
    {
      kind: "p",
      text: "With these basics in place you can move on to the exercises of the Mathematical logic module.",
    },
  ],

  7: [
    { kind: "h", text: "The multiplication principle" },
    {
      kind: "p",
      text: "The multiplication principle drives all of combinatorics: if one choice can be made in $r$ ways and a second, independent one in $s$ ways, the two together can be made in $r \\cdot s$ ways.",
    },
    { kind: "h", text: "Simple arrangements" },
    {
      kind: "p",
      text: "They count the orderings of $k$ elements chosen from $n$, without repetition: codes with distinct digits, rankings, podiums.",
    },
    { kind: "formula", tex: "D_{n,k} = n\\,(n-1)\\cdots(n-k+1) = \\frac{n!}{(n-k)!}" },
    { kind: "h", text: "Arrangements with repetition" },
    {
      kind: "p",
      text: "They count sequences where each element may come back: padlocks, plates, passwords.",
    },
    { kind: "formula", tex: "D'_{n,k} = n^k" },
    { kind: "h", text: "Permutations" },
    {
      kind: "p",
      text: "The special case $k = n$: the anagrams of a word with no repeated letters.",
    },
    { kind: "formula", tex: "P_n = n!" },
    {
      kind: "p",
      text: "When letters repeat, divide by the factorials of the repetitions so the same anagram is not counted twice:",
    },
    { kind: "formula", tex: "P_n^{(r_1,\\dots,r_m)} = \\frac{n!}{r_1!\\,r_2!\\cdots r_m!}" },
    {
      kind: "callout",
      tone: "note",
      title: "The two questions to always ask",
      body: ["Does order matter?", "Can elements repeat?"],
    },
  ],

  8: [
    { kind: "h", text: "When order does not matter" },
    {
      kind: "p",
      text: "Combinations count groups of $k$ elements chosen from $n$, without repetition and without roles: committees, teams, simultaneous draws.",
    },
    { kind: "formula", tex: "C_{n,k} = \\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}" },
    {
      kind: "p",
      text: "The link with arrangements is immediate: each group of $k$ people corresponds to $k!$ orderings, which must be counted once.",
    },
    { kind: "formula", tex: "\\binom{n}{k} = \\frac{D_{n,k}}{k!}" },
    { kind: "h", text: "Quotas across groups" },
    {
      kind: "p",
      text: "With constraints on distinct groups you multiply, because the choices are independent: picking $x$ girls out of $a$ and $y$ boys out of $b$ gives",
    },
    { kind: "formula", tex: "\\binom{a}{x}\\binom{b}{y}" },
    {
      kind: "callout",
      tone: "warning",
      title: "«Unlabelled» groups",
      body: [
        "Splitting 6 students into 3 pairs is not $\\binom{6}{2}\\binom{4}{2}\\binom{2}{2} = 90$: the three groups are indistinguishable and each split was counted $3!$ times.",
        "You must divide by $k!$, exactly as when moving from arrangements to combinations: $\\frac{90}{3!} = 15$.",
      ],
    },
    { kind: "h", text: "Classic test applications" },
    {
      kind: "list",
      items: [
        "The diagonals of an $n$-sided polygon: $\\binom{n}{2} - n$, since every pair of vertices gives a segment and the sides are removed.",
        "The subsets of an $n$-element set: $2^n$, since for each element you decide whether to take it.",
        "Pascal's triangle, where each number is the sum of the two above it and row $n$ lists the coefficients $\\binom{n}{k}$.",
      ],
    },
  ],

  9: [
    { kind: "h", text: "Laplace's classical definition" },
    {
      kind: "p",
      text: "The probability of an event is the ratio of favourable cases to possible cases, all equally likely.",
    },
    { kind: "formula", tex: "P(A) = \\frac{\\text{favourable cases}}{\\text{possible cases}}" },
    { kind: "h", text: "Union of events" },
    { kind: "p", text: "Mutually exclusive events add up:" },
    { kind: "formula", tex: "P(A \\cup B) = P(A) + P(B)" },
    { kind: "p", text: "If the events can occur together, the intersection must be removed once:" },
    { kind: "formula", tex: "P(A \\cup B) = P(A) + P(B) - P(A \\cap B)" },
    {
      kind: "callout",
      tone: "warning",
      title: "The most frequent source of distractors",
      body: [
        "Forgetting to subtract the intersection produces a wrong but plausible result: it is the mistake exam questions set up most often.",
      ],
    },
    { kind: "h", text: "Intersection and conditioning" },
    { kind: "p", text: "Independent events multiply:" },
    { kind: "formula", tex: "P(A \\cap B) = P(A)\\,P(B)" },
    {
      kind: "p",
      text: "If the second experiment depends on the first (draws without replacement), you need conditional probability, with the chain product $P(A)\\,P(B \\mid A)$:",
    },
    { kind: "formula", tex: "P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}" },
    {
      kind: "callout",
      tone: "note",
      title: "Before adding or multiplying",
      body: ["Always ask: are the events exclusive, or can they happen together?"],
    },
  ],

  10: [
    { kind: "h", text: "Total probability" },
    {
      kind: "p",
      text: "When an experiment runs through several stages, the probability tree organises the computation: add the branches leading to the same outcome.",
    },
    {
      kind: "formula",
      tex: "P(D) = P(D \\mid M_1)\\,P(M_1) + P(D \\mid M_2)\\,P(M_2)",
      caption: "Two machines with different output shares and defect rates",
    },
    { kind: "h", text: "Bayes' theorem" },
    {
      kind: "p",
      text: "Bayes walks the tree backwards: given that the item is defective, how likely is it that it came from the first machine?",
    },
    { kind: "formula", tex: "P(M_1 \\mid D) = \\frac{P(D \\mid M_1)\\,P(M_1)}{P(D)}" },
    {
      kind: "callout",
      tone: "warning",
      title: "The classic mistake",
      body: [
        "Confusing $P(A \\mid B)$ with $P(B \\mid A)$: the direction of conditioning is reversed. This is the trap exam questions tend to set.",
      ],
    },
    { kind: "h", text: "The Bernoulli scheme" },
    {
      kind: "p",
      text: "It counts successes in $n$ independent trials with probability $p$, where $q = 1 - p$:",
    },
    { kind: "formula", tex: "P(k \\text{ successes}) = \\binom{n}{k} p^k q^{\\,n-k}" },
    { kind: "p", text: "For «at least one» events it is easier to use the complement:" },
    { kind: "formula", tex: "P(\\text{at least one}) = 1 - q^{\\,n}" },
    { kind: "h", text: "The pigeonhole principle" },
    {
      kind: "p",
      text: "Dirichlet's principle guarantees certainty in the worst case: with $m$ colours, to be sure of $k$ items of the same colour it is enough to draw",
    },
    { kind: "formula", tex: "m\\,(k-1) + 1" },
    {
      kind: "p",
      text: "items, because the first $m\\,(k-1)$ can spread at most $k-1$ items per colour.",
    },
  ],

  11: [
    {
      kind: "p",
      text: "This lesson collects the four schemes that separate a demanding question from a routine one, following Maurizio Trombetta's manual «Calcolo combinatorio · Teoria e problemi».",
    },
    { kind: "h", text: "1. Combinations with repetition: «stars and bars»" },
    {
      kind: "p",
      text: "Distributing $k$ identical objects among $n$ distinct recipients is the same as lining up $k$ stars and $n-1$ separating bars:",
    },
    { kind: "formula", tex: "C'_{n,k} = \\binom{k+n-1}{\\,n-1\\,}" },
    {
      kind: "example",
      title: "Sweets for the children",
      body: [
        "10 identical sweets among 3 children give $\\binom{12}{2} = 66$ ways.",
        "If each child must get at least 2, hand out the minimum first (6 sweets) and apply the formula to the remaining 4: $\\binom{6}{2} = 15$.",
      ],
    },
    {
      kind: "callout",
      tone: "warning",
      title: "If the sweets are all different",
      body: [
        "The model changes entirely: these are no longer stars and bars but arrangements with repetition, $3^{10} = 59\\,049$.",
      ],
    },
    { kind: "h", text: "2. Circular permutations" },
    {
      kind: "p",
      text: "Around a round table, seatings that differ by a rotation are the same: fix one person as a reference and count the others.",
    },
    { kind: "formula", tex: "\\frac{n!}{n} = (n-1)!" },
    {
      kind: "p",
      text: "If mirror reflections are irrelevant too — as on a bead bracelet — divide by 2 again, giving $\\frac{(n-1)!}{2}$. With the constraint «two people not adjacent», fix the first and rule out the two neighbouring seats for the second:",
    },
    { kind: "formula", tex: "(n-3)\\,(n-2)!" },
    { kind: "h", text: "3. The binomial theorem" },
    { kind: "p", text: "The expansion of $(a+b)^n$ has general term" },
    { kind: "formula", tex: "\\binom{n}{k} a^k b^{\\,n-k}" },
    {
      kind: "p",
      text: "The binomial coefficient must always be multiplied by the powers of the bases. Moreover:",
    },
    {
      kind: "list",
      items: [
        "symmetry, $\\binom{n}{k} = \\binom{n}{n-k}$;",
        "Stifel's rule, $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$, which builds Pascal's triangle;",
        "the row sum, $\\sum_{k=0}^{n} \\binom{n}{k} = 2^n$.",
      ],
    },
    { kind: "h", text: "4. The inclusion–exclusion principle" },
    { kind: "p", text: "For two sets:" },
    { kind: "formula", tex: "|A \\cup B| = |A| + |B| - |A \\cap B|" },
    { kind: "p", text: "For three sets the signs alternate:" },
    {
      kind: "formula",
      tex: "|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|",
    },
    {
      kind: "callout",
      tone: "warning",
      title: "The most frequent mistake",
      body: [
        "Forgetting to add the triple intersection back: those elements were counted three times and then subtracted three times, so they vanish from the count.",
      ],
    },
  ],
};
