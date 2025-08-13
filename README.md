v0.2

# Projeto para Dota 2

## React-Native + Web

### Objetivos
-Tela de Draft exibi os heróis por ordem de melhores escolhas, também fornece a possibilidade de escolher os jogadores do time, clicar no slot calcula o Rank Pessoal do jogador com cada herói e aplica na tabela, clicar nos slots que não há jogadores apenas ignora o rank pessoal. Aplicar heróis em slots aliados altera a lista de sugestões para sugerir bons aliados para os heróis aplicados. Aplicar heróis em slots inimigos altera a lista de sugestões devido a sugerir bons heróis contra os heróis inimigos aplicados. Aplicar heróis em slots banidos altera a lista de sugestões devido a sugerir heróis que se beneficiam dos banimentos aplicados.  
  
-Tela de Heróis inicialmente projetada para inserir os heróis e mostrar individualmente os melhores aliados, quais heróis gosta de enfrentar e quais detesta.  

  
-Tela de Meta exibe os heróis pelo Winrate e pelo MetaScore, o metascore é definido pelo número de partidas profissionais onde o herói é selecionado ou banido, o valor 10 se aplica ao herói mais escolhido ou banido o valor -10 se aplica ao herói 100% ignorado.  

  
-Tela de Jogadores exibe os jogadores cadastrados no aplicativo.  

  
-Tela de Configurações tem o botão atualizar o meta, e adicionar jogador também terá o botão atualizar jogadores.  
  
### Bugs
-Tela de Draft na versão de apk não aplica rank pessoal ainda então a seleção de jogador não afeta em nada.  

  
-Tela de Heróis, as vezes no mobile o campo de texto tira o focus, simples de resolver ainda preciso melhorar isso, Rolagem da página de Sinergia foi esquecida.  

  
-Tela de Meta a falta de um cabeçalho dificulta a ordenação na versão apk.  
  
-Tabbar está quebrada

### Melhorias
-Tela de Draft talvez adicionar a imagem do player ao inves do nome do player após ele ser selecionado, principalmente mobile. Refinar a fórmula buscando alcançar valores mais justos, que leve a resultados mais positivos.  

  
-Tela de Heróis talvez fosse interessante adicionar alguns elementos adicionais a tela de sinergia como vozes do herói ou Lore. Também falta adicionar um botão de redefinir ou voltar quando entramos na tela de sinergia retornar a tela de heróis novamente, há um meio para isso mas não intuitivo.  

  
-Tela de Jogadores no aplicativo poderia ter uma margem maior acima do cabeçalho, o espaçamento entre jogadores poderia reduzir.  

## Algumas Especificidades do Projeto  
- O projeto é feito sem banco de dados, apenas com arquivos json. Será criado um banco de dados que será atualizado por requisições json, a atualização ocorrerá apenas se o codigo 200 for retornado. Meta, Jogadores e Heróis.  
  

-O projeto web está rodando bem na versão web local, mas ainda existem problemas na versao de build -web principalmente em relação a renderização que não foi arrumada [avadrafter.vercel.app
](https://avadrafter.vercel.app/)
