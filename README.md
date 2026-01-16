# 🐺 Robotic Wolf – Three.js Interactive Project

Projeto 3D interativo desenvolvido em **Three.js**, apresentando um **lobo robótico low-poly** com animações, comportamento autónomo e interação por clique, incluindo **mandíbula animada com som realista**.

Este projeto explora conceitos de **modelação procedural**, **animação hierárquica**, **interação em tempo real** e **Web Audio API**.

---

## ✨ Funcionalidades

- 🐺 Lobo robótico low-poly construído inteiramente em código
- 🦴 Mandíbula articulada com pivot correto
- 🔊 Som real de lobo sincronizado com abertura da boca
- 🖱️ Click-to-move: o lobo move-se para o ponto clicado no chão
- 🧭 Rotação suave em direção ao destino
- 🧱 Limites do terreno com mudança automática de direção
- 🎥 Câmara interativa com OrbitControls
- 🌙 Iluminação dinâmica + sombras suaves
- ⚙️ Animação procedural das pernas, cabeça e cauda

---

## 🛠️ Tecnologias Utilizadas

- **JavaScript (ES6)**
- **Three.js**
- **Web Audio API**
- **HTML5 / WebGL**

---

## 🎮 Controlos

| Ação | Resultado |
|----|----|
| Clique no chão | O lobo move-se para o ponto |
| Clique no lobo | Abre/fecha a mandíbula |
| Tecla `R` | Alterna modo de corrida |
| Arrastar rato | Rodar a câmara |
| Scroll | Zoom |

---

## 🔊 Áudio

- Som real de lobo obtido via Google Animal Sounds
- Áudio carregado uma única vez (sem lag)
- Loop enquanto a mandíbula está aberta
- Fade-out suave ao fechar a boca

---

## 🧠 Estrutura Técnica

- **Group hierarchy** para articulações (cabeça, mandíbula, pernas)
- **Raycasting** para deteção de cliques
- **State-based logic** para movimento e som
- **Easing functions** para animações naturais
- **Boundary logic** para evitar saída do terreno

---

## 📁 Estrutura do Projeto
```
/project
│
├── index.html
├── script.js
├── README.md
└── style.css
```
---

⚠️ O áudio só funciona corretamente via servidor (não abrir o HTML diretamente).

---

## 🧪 Estado do Projeto

✅ Funcional
🧩 Modular
🎨 Estilizado
🚧 Em evolução

---

## 🔮 Possíveis Melhorias Futuras

Estados de IA (idle / patrol / alert / attack)

Bite attack com hitbox

Áudio espacial 3D ligado à cabeça

Pathfinding simples

Exportação do modelo para GLTF

Interface UI para controlo de comportamento

---

## 👤 Autor

Sérgio Alves
Projeto desenvolvido para fins académicos e exploratórios em computação gráfica e interação 3D.
