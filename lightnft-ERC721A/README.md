# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
Burn é feito apenas pelo owner ou approved do token
libera o burn para o user (metamask client side nescessário) user paga transferencia
front informa back sobre o sucesso do burn, back minta o novo token e transfere
OU
aplicação solicita que o user dê approval (metamask client side nescessário) user paga transferencia
back faz o burn como approval, minta o novo token e transfere