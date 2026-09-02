# PoC — Wizard di inserimento annunci

Wizard a 3 Step con validazione per mercato, campi condizionali e riepilogo errori
cliccabile. React 19 + TypeScript, Formik 2.4.9, Yup 1.7.1, React Router 7 (BrowserRouter).

```bash
npm install && npm run dev
```

Il vocabolario del dominio è in [CONTEXT.md](./CONTEXT.md); le decisioni e il perché in
[docs/adr](./docs/adr).

## Cosa provare

Il `<select>` **Tenant** in alto è uno strumento di demo, non una funzionalità: cambiarlo
azzera la Bozza, perché i Campi dei due mercati non coincidono.

1. **Riepilogo errori** — su un qualsiasi Step premi *Avanti* senza compilare nulla. Le voci
   sono nell'ordine in cui i Campi appaiono a schermo, e cliccarne una porta il focus sul Campo.
2. **Discriminante** — nello Step *Caratteristiche*, sezione *Contratto e prezzo*: scegli
   `Affitto`, compila il canone, poi passa a `Vendita`. I Campi dell'affitto spariscono e il
   loro valore esce dalla Bozza; il codice fiscale, che non dipende dal Discriminante, resta.
   Tornando su `Affitto` il canone è vuoto: è il "drop immediato" deciso di proposito.
3. **Variazione di tipo A** (stesso Campo, formato diverso) — CAP `99999` è valido in IT e
   rifiutato in ES, dove le prime due cifre devono indicare una provincia (01-52).
4. **Variazione di tipo B** (Campi diversi) — *Codice fiscale* in IT diventa *NIF* in ES.
5. **Variazione di tipo C** (Sezioni diverse) — *Caratteristiche* ha 4 Sezioni in IT e 3 in ES:
   *Dati catastali* non esiste in Spagna.
6. **Payload** — alla fine viene mostrato l'oggetto che sarebbe spedito al backend. I numeri
   sono numeri e non stringhe, e non contiene residui del ramo abbandonato.

## Come è fatto

```
src/domain/      tipi del dominio e costruttori di Campo
src/sections/    una Sezione per file: Campi, schema e varianti per Tenant
src/wizard/      composizione per Tenant, schema, valori, riepilogo errori, payload
src/components/  rendering
```

Il pezzo da leggere per primo è [`src/sections/contrattoEPrezzo.ts`](./src/sections/contrattoEPrezzo.ts):
è l'unica Sezione dove un Discriminante e una variazione per Tenant convivono, cioè il punto
in cui i due meccanismi potrebbero interferire.

## Tre punti dove il codice si discosta dalla strada ovvia

**Niente `.when()`.** I Campi condizionali sono dichiarati come mappa totale
`Record<TipoContratto, FieldDescriptor[]>`. Aggiungere un valore al Discriminante è quindi un
errore di compilazione, non un ramo `otherwise` che rende opzionale in silenzio ciò che
dovrebbe essere obbligatorio. La stessa mappa guida rendering, validazione e pulizia:
UI e schema non possono divergere. Vedi [ADR 0003](./docs/adr/0003-discriminanti-invece-di-when-sparse.md).

**Niente `isValid`.** Su un form pristine Formik riporta `isValid: true` perché `errors` è
ancora vuoto; con `validateOnMount` riporterebbe `false` senza mostrare alcun errore. *Avanti*
chiama `validateForm()` e legge il risultato — vedi `StepForm.tsx`.

**Un'unica funzione produce il payload.** `buildPayload` passa dal `cast` dello schema.
Lo spread diretto della Bozza produrrebbe numeri come stringhe.

## Limiti noti, tutti deliberati

- La validazione copre **solo lo Step corrente**, mai la Bozza intera: tornando indietro a
  svuotare un Campo si può pubblicare un annuncio incompleto. Scelta consapevole, con il
  rischio scritto in [ADR 0006](./docs/adr/0006-validazione-limitata-allo-step-corrente.md).
- Nessuna persistenza: un refresh su uno Step successivo riporta al primo.
- Upload simulati: i `File` restano in memoria, nessuna chiamata di rete.
- Interfaccia in italiano anche per il tenant ES, tranne le etichette che variano per mercato.
  I messaggi di errore sono stringhe e non chiavi i18n: il contratto d'errore condiviso con
  BFF e backend è fuori scope, vedi [ADR 0004](./docs/adr/0004-regole-duplicate-su-tre-livelli.md).
- Le regex di codice fiscale e NIF sono verifiche di forma, non di checksum.
