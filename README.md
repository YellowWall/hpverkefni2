# Hópverkefni 2

Til þess að setja upp tól er skpunin `npm install` keyrð.
Skrár sem notaðar eru í þróun eru ekki settar inn í git heldur eru skrárnar geymdar í `.gitignore`.

[Verkefnið á Netlify](https://flamboyant-heisenberg-ad356b.netlify.app/)

## Þróun (_development_)

Þróunarumhverfi er gangsett með skipuninni `npm run dev` sem þýðir SASS skrár yfir í CSS og kveikir á browser-sync sem fylgist með html skrám og þýddri CSS skrá. Skipunin `npm run lint-scss` keyrir svo stylelint á SASS skrárnar sem fer yfir hvort kóðinn sé rétt settur upp eftir grunn staðli. Einnig er til staðar skipunin `npm run lint` sem keyrir eslint á allar JavaScript skrár og athugar uppsetningu.

## Skipulag vefs

Vefnum er skipt upp í nokkrar möppur og önnur skjöl. Innan rótarinnar eru eftirfarandi:

- `index.html` er upphafssíða vefsins.
- `main.js` sem er aðal keyrsluskrá JavaScript.
- `styles.scss` tekur saman allar sass skrár saman.
- `data.json` tilraunagögn fyrir API request.
- `.eslintrc.js` og `.stylelintrc` sem innihalda gögn sem þarf til að nota lint tól í VSCode.
- `package.json` inniheldur allar þær skipanir sem hægt er að keyra í þróun auk lista þeirra tóla sem notuð eru.
- `package-lock.json` er skjölun allra tóla sem þarf til þess að geta notað þau aðaltól sem eru innan `package.json`.

Innan rótarinnar eru svo eftirfarandi möppur:

- `/styles` geymir SASS stíla og eru skrárnar og þeirra hlutverk eftirfarandi:
  - `_base.scss` inniheldur grunngildi fyrir alla síðuna.
  - `_buttons.scss` segir til um uppsetningu takka á síðunni.
  - `_fonts.scss` setur upp textastíla síðunnar og uppsetningu texta.
  - `layout` innihledur grind og strúktúr hvers hlutar innan vefsins.
  - `_variables.scss` geymir allar þær brytur sem eru notaðar í stílum.
- `/lib` er samansafn kJavaScript eininga sem keyrðar eru á vefnum:
  - `data.js` sækir gögn (í þessari útgáfu eru gögn aðeins sótt í `data.json` skrá) sem birt eru á vefnum.
  - `helpers.js` geymir hjálparföll, líkt og element smið, fall sem tæmir element og fleira.
  - `localstorage.js` vinnur með, og vistar, gögn í localStorage í vafranum.
  - `ui.js` birtir dýnamískt útlit vefsins og fylgist með virkni hans.

## Raun (_production_)

Vefurinn er byggður með skipuninni:

- `build-win` fyrir Windows stýrikerfi.
- `build-unix` fyrir MacOS og Linux.

Byggðar skrár eru geymdar í `/build` möppu sem innifalin er í `.gitignore`.

## Teymi

- **Atli Snær Ásmundsson**
  - _Tölvupóstur:_ `asa71@hi.is`
  - _Github_: `AtliAsmunds`
- **Bjarni Þór Sigurðsson**
  - \*Tölvupóstur: `bths2@hi.is`
  - _Github_: `BjarniHaskoli`
- **Ilaria Rosso Colletti**
  - _Tölvupóstur:_ `irc3@hi.is`
  - _Github_: `ilaria20`
- **Ívar Sigurðsson**
  - \*Tölvupóstur: `ivarsig94@gmail.com`
  - _Github_: `YellowWall`
