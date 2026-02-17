# TODO - Skull King Companion

## Fait

- [x] Vérifier la compilation TypeScript (`npx tsc --noEmit`)
- [x] Configurer EAS (`eas.json` avec `buildType: "apk"`)
- [x] Corriger le bundle JS (ajout `babel-preset-expo`)
- [x] Générer le projet Android natif (`npx expo prebuild --platform android`)
- [x] Résoudre l'erreur de chemins trop longs Windows (copie vers `C:\sk-app\`)
- [x] Builder l'APK (`gradlew assembleRelease`) — 70MB
- [x] Corriger les bonus selon les règles officielles 2022 (sirène par pirate, 14 couleur/noir, SK par sirène)
- [x] Ajouter le composant ScoreSummary (scores en temps réel pendant enchères et résultats)
- [x] Valider la somme des plis (doit égaler le numéro de la manche)
- [x] Augmenter les tailles (polices, boutons, paddings) sur tous les écrans
- [x] Éclaircir les couleurs du thème pour un meilleur contraste
- [x] Ajouter la reprise de partie en cours (sauvegarde/restauration via AsyncStorage)
- [x] Ajouter l'historique des manches (accordéon dans le tableau des scores)
- [x] Rebuild APK avec toutes les corrections

## À faire

- [ ] Tester l'APK sur un appareil Android
- [ ] Ajouter une icône d'app personnalisée
- [ ] Ajouter un splash screen personnalisé
