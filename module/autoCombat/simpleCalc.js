/*
    * Simple Calculator for Foundry VTT
    * This script provides a simple calculator dialog for calculating combat outcomes based on attack, damage, defense, and armor values.
*/

// Utility: Damage percentage calculator
function calculateDamagePercentage(diff, armorCount) {
    if (diff <= 0) return 0;
  
    if (armorCount === 0) {
      if (diff < 30) return 0;
      if (diff < 40) return 0.10;
      if (diff < 50) return 0.30;
      if (diff < 60) return 0.50;
      return (Math.floor((diff - 60) / 10) + 6) * 0.10;
    }
  
    if (armorCount === 1) {
      if (diff < 30) return 0;
      if (diff < 40) return 0.10;
      if (diff < 50) return 0.20;
      if (diff < 60) return 0.40;
      return (Math.floor((diff - 60) / 10) + 5) * 0.10;
    }
  
    if (armorCount >= 2) {
      const start = armorCount * 10;
      if (diff <= start) return 0;
      return Math.floor((diff - start) / 10) * 0.10;
    }
  
    return 0;
  }
  
  // Simple Calculator Dialog
  export function openSimpleCalculator() {
    const content = `
      <style>
        #simple-calc-form .form-group {
          margin-bottom: 10px;
        }
        #simple-calc-form label {
          display: block;
          font-weight: bold;
          margin-bottom: 2px;
        }
        #simple-calc-form input {
          width: 100%;
        }
      </style>
      <form id="simple-calc-form">
        <div class="form-group">
          <label>Attack</label>
          <input type="number" name="attack" tabindex="1" />
        </div>
        <div class="form-group">
          <label>Damage</label>
          <input type="number" name="damage" tabindex="2" />
        </div>
        <div class="form-group">
          <label>Defense</label>
          <input type="number" name="defense" tabindex="3" />
        </div>
        <div class="form-group">
          <label>Armor (AT)</label>
          <input type="number" name="armor" tabindex="4" />
        </div>
      </form>
    `;
  
    new Dialog({
      title: "Simple Calculator",
      content: content,
      buttons: {
        calculate: {
          icon: '<i class="fas fa-calculator"></i>',
          label: "Calculate",
          callback: html => {
            const form = html.find("#simple-calc-form")[0];
            const data = {
              attack: parseInt(form.attack.value) || 0,
              damage: parseInt(form.damage.value) || 0,
              defense: parseInt(form.defense.value) || 0,
              armor: parseInt(form.armor.value) || 0
            };
  
            const diff = data.attack - data.defense;
            let resultMessage = `<b>Attack: ${data.attack} | Damage: ${data.damage}</b>`;
            resultMessage += `<b>Defense: ${data.defense} | Armor (AT): ${data.armor}</b><br>`;
  
            if (diff < 0) {
              const counter = Math.floor(Math.abs(diff) / 2);
              resultMessage += `<b>Counterattack Bonus: +${counter}</b>`;
            } else {
              const damagePercent = calculateDamagePercentage(diff, data.armor);
              const actualDamage = Math.round(data.damage * damagePercent);
              const losesAction = true;
  
              resultMessage += `<b>Hit! </b><br>`;
              resultMessage += `<b>Damage: ${Math.round(damagePercent * 100)}%</b>`;
              resultMessage += `<b>Final Damage: ${actualDamage}</b><br>`;
              if (losesAction) resultMessage += `<b>Defender loses 1 Action</b>`;
            }
  
            ChatMessage.create({
              user: game.user.id,
              content: resultMessage,
              whisper: [game.user.id]
            });

            console.log("Calculator Input:", data);
          }
        },
        cancel: {
          label: "Cancel"
        }
      },
      default: "calculate"
    }).render(true);
  
    setTimeout(() => {
      document.querySelector("#simple-calc-form input")?.focus();
      document.querySelector("#simple-calc-form")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          document.querySelector(".dialog button[data-button=calculate]")?.click();
        }
      });
    }, 100);
}
