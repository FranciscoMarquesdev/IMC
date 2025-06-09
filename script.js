// Create particles
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 15 + "s";
    particle.style.animationDuration = Math.random() * 10 + 10 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Calculator functionality
document
  .getElementById("calculatorForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Show loading
    document.getElementById("loading").style.display = "block";
    document.getElementById("results").style.display = "none";

    setTimeout(() => {
      calculateResults();
      document.getElementById("loading").style.display = "none";
      document.getElementById("results").style.display = "block";
      document.getElementById("results").scrollIntoView({ behavior: "smooth" });
    }, 2000);
  });

function calculateResults() {
  const sexo = document.getElementById("sexo").value;
  const idade = parseInt(document.getElementById("idade").value);
  const altura = parseInt(document.getElementById("altura").value);
  const peso = parseFloat(document.getElementById("peso").value);
  const objetivo = document.getElementById("objetivo").value;
  const treinos = parseInt(document.getElementById("treinos").value);

  // Calculate IMC
  const imc = peso / (altura / 100) ** 2;

  // IMC Classification
  let classificacao, statusClass;
  if (imc < 18.5) {
    classificacao = "Abaixo do peso";
    statusClass = "status-abaixo";
  } else if (imc < 25) {
    classificacao = "Peso normal";
    statusClass = "status-normal";
  } else if (imc < 30) {
    classificacao = "Sobrepeso";
    statusClass = "status-sobrepeso";
  } else {
    classificacao = "Obesidade";
    statusClass = "status-obesidade";
  }

  // Calculate TMB
  let tmb;
  if (sexo === "masculino") {
    tmb = 10 * peso + 6.25 * altura - 5 * idade + 5;
  } else {
    tmb = 10 * peso + 6.25 * altura - 5 * idade - 161;
  }

  // Activity factor
  let fatorAtividade;
  if (treinos === 0) fatorAtividade = 1.2;
  else if (treinos <= 2) fatorAtividade = 1.375;
  else if (treinos <= 4) fatorAtividade = 1.55;
  else if (treinos <= 6) fatorAtividade = 1.725;
  else fatorAtividade = 1.9;

  const caloriasDiarias = tmb * fatorAtividade;

  // Macronutrients distribution
  let proteinasPerc, carboidratosPerc, gordurasPerc;
  if (objetivo === "emagrecer") {
    proteinasPerc = 35;
    carboidratosPerc = 35;
    gordurasPerc = 30;
  } else if (objetivo === "manter") {
    proteinasPerc = 30;
    carboidratosPerc = 40;
    gordurasPerc = 30;
  } else {
    proteinasPerc = 30;
    carboidratosPerc = 50;
    gordurasPerc = 20;
  }

  const proteinasGramas = Math.round(
    (caloriasDiarias * proteinasPerc) / 100 / 4
  );
  const carboidratosGramas = Math.round(
    (caloriasDiarias * carboidratosPerc) / 100 / 4
  );
  const gordurasGramas = Math.round((caloriasDiarias * gordurasPerc) / 100 / 9);

  // Display results
  document.getElementById("imcValue").textContent = imc.toFixed(1);
  document.getElementById("imcStatus").textContent = classificacao;
  document.getElementById("imcStatus").className = `imc-status ${statusClass}`;

  // IMC Alert
  const alertDiv = document.getElementById("imcAlert");
  if (imc > 25) {
    alertDiv.innerHTML =
      '<div class="alert"><i class="fas fa-exclamation-triangle"></i> Atenção: Seu IMC está acima do recomendado</div>';
  } else {
    alertDiv.innerHTML = "";
  }

  document.getElementById("tmbValue").textContent = Math.round(tmb);
  document.getElementById("caloriasValue").textContent =
    Math.round(caloriasDiarias);

  // Macronutrients
  document.getElementById("proteinValue").textContent = `${proteinasGramas}g`;
  document.getElementById("proteinPerc").textContent = `${proteinasPerc}%`;
  document.getElementById("carbValue").textContent = `${carboidratosGramas}g`;
  document.getElementById("carbPerc").textContent = `${carboidratosPerc}%`;
  document.getElementById("fatValue").textContent = `${gordurasGramas}g`;
  document.getElementById("fatPerc").textContent = `${gordurasPerc}%`;

  // Animate progress rings
  animateProgressRing("proteinProgress", proteinasPerc);
  animateProgressRing("carbProgress", carboidratosPerc);
  animateProgressRing("fatProgress", gordurasPerc);

  // Store data for plan
  window.calculatedData = {
    sexo,
    idade,
    altura,
    peso,
    objetivo,
    treinos,
    imc: imc.toFixed(1),
    tmb: Math.round(tmb),
    calorias: Math.round(caloriasDiarias),
    proteinas: proteinasGramas,
    carboidratos: carboidratosGramas,
    gorduras: gordurasGramas,
    proteinasPerc,
    carboidratosPerc,
    gordurasPerc,
  };
}

function animateProgressRing(id, percentage) {
  const circle = document.getElementById(id);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (percentage / 100) * circumference;

  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 500);
}

// Modal functionality
const modal = document.getElementById("planModal");
const btnPlan = document.getElementById("btnPlan");
const closeBtn = document.querySelector(".close");

btnPlan.onclick = () => (modal.style.display = "block");
closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// Contact form
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const data = window.calculatedData;

  // Create WhatsApp message
  const message = `SOLICITAÇÃO DE PLANO PERSONALIZADO

Dados Pessoais:
• Nome: ${nome}
• E-mail: ${email}
• WhatsApp: ${whatsapp}

Dados Biométricos:
• Sexo: ${data.sexo}
• Idade: ${data.idade} anos
• Altura: ${data.altura} cm
• Peso: ${data.peso} kg
• Objetivo: ${data.objetivo}
• Treinos/semana: ${data.treinos}

Resultados Calculados:
• IMC: ${data.imc}
• TMB: ${data.tmb} kcal
• Calorias diárias: ${data.calorias} kcal

Macronutrientes:
• Proteínas: ${data.proteinas}g (${data.proteinasPerc}%)
• Carboidratos: ${data.carboidratos}g (${data.carboidratosPerc}%)
• Gorduras: ${data.gorduras}g (${data.gordurasPerc}%)

Gostaria de receber um plano alimentar personalizado!`;

  // Open WhatsApp
  const whatsappUrl = `https://wa.me/5581999854550?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");

  // Show success message
  document.getElementById("contactForm").style.display = "none";
  document.getElementById("successMessage").style.display = "block";

  setTimeout(() => {
    modal.style.display = "none";
    document.getElementById("contactForm").style.display = "grid";
    document.getElementById("successMessage").style.display = "none";
    document.getElementById("contactForm").reset();
  }, 3000);
});

// Scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Initialize
createParticles();

// Phone mask
document.getElementById("whatsapp").addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d{5})(\d)/, "$1-$2");
  e.target.value = value;
});

// Diagnóstico: Forçar background no body para testar no mobile
document.body.style.background = "#181c2c"; // Substitua pela cor desejada do seu CSS
