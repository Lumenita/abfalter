import { renderTemplates } from '../utilities/renderTemplates.js';
import { templates } from '../utilities/templates.js';

export const openOneModDialog = async () => {
    return oneModDialog({
        content: "Modifier",
        placeholder: '0'
    });
}

export const oneModDialog = async ({ content, placeholder = '' }) => {
    const html = await renderTemplates({
        name: templates.dialog.initiative,
        context: {
            content,
            placeholder
        }
    });
    return new Promise(resolve => {
        new Dialog({
            title: 'Secondary Changer',
            content: html,
            buttons: {
                submit: {
                    label: 'Confirm',
                    callback: html => {
                        const results = new FormDataExtended(html.find('form')[0], {}).object;
                        resolve(results['dialog-input']);
                    }
                },
                cancel: {
                    label: 'Cancel',
                    callback: () => resolve(null)
                }
            },
            render: () => $('#dialog-input').focus()
        }).render(true);
    });
}

export async function changeSecondaryTemps(actorData) {
    const mod = await openOneModDialog() || 0;

    actorData.update({
        "system.secondary.acrobatics.temp": mod, "system.secondary.athleticism.temp": mod, "system.secondary.climb.temp": mod, "system.secondary.jump.temp": mod,
        "system.secondary.ride.temp": mod, "system.secondary.swim.temp": mod, "system.secondary.etiquette.temp": mod, "system.secondary.intimidate.temp": mod,
        "system.secondary.leadership.temp": mod, "system.secondary.persuasion.temp": mod, "system.secondary.streetwise.temp": mod, "system.secondary.style.temp": mod,
        "system.secondary.trading.temp": mod, "system.secondary.notice.temp": mod, "system.secondary.search.temp": mod, "system.secondary.track.temp": mod,
        "system.secondary.animals.temp": mod, "system.secondary.appraisal.temp": mod, "system.secondary.architecture.temp": mod, "system.secondary.herballore.temp": mod,
        "system.secondary.history.temp": mod, "system.secondary.law.temp": mod, "system.secondary.magicappr.temp": mod, "system.secondary.medicine.temp": mod,
        "system.secondary.memorize.temp": mod, "system.secondary.navigation.temp": mod, "system.secondary.occult.temp": mod, "system.secondary.science.temp": mod,
        "system.secondary.tactics.temp": mod, "system.secondary.composure.temp": mod, "system.secondary.featsofstr.temp": mod, "system.secondary.withstpain.temp": mod,
        "system.secondary.disguise.temp": mod, "system.secondary.hide.temp": mod, "system.secondary.lockpicking.temp": mod, "system.secondary.poisons.temp": mod,
        "system.secondary.stealth.temp": mod, "system.secondary.theft.temp": mod, "system.secondary.traplore.temp": mod, "system.secondary.alchemy.temp": mod,
        "system.secondary.animism.temp": mod, "system.secondary.art.temp": mod, "system.secondary.dance.temp": mod, "system.secondary.forging.temp": mod,
        "system.secondary.jewelry.temp": mod, "system.secondary.music.temp": mod, "system.secondary.runes.temp": mod, "system.secondary.ritualcalig.temp": mod,
        "system.secondary.slofhand.temp": mod, "system.secondary.tailoring.temp": mod, "system.secondary.piloting.temp": mod, "system.secondary.cooking.temp": mod,
        "system.secondary.technomagic.temp": mod, "system.secondary.toymaking.temp": mod, "system.secondary.kidetection.temp": mod, "system.secondary.kiconceal.temp": mod
    })
}

export async function changeSecondarySpecs(actorData) {
    const mod = await openOneModDialog() || 0;

    actorData.update({
        "system.secondary.acrobatics.spec": mod, "system.secondary.athleticism.spec": mod, "system.secondary.climb.spec": mod, "system.secondary.jump.spec": mod,
        "system.secondary.ride.spec": mod, "system.secondary.swim.spec": mod, "system.secondary.etiquette.spec": mod, "system.secondary.intimidate.spec": mod,
        "system.secondary.leadership.spec": mod, "system.secondary.persuasion.spec": mod, "system.secondary.streetwise.spec": mod, "system.secondary.style.spec": mod,
        "system.secondary.trading.spec": mod, "system.secondary.notice.spec": mod, "system.secondary.search.spec": mod, "system.secondary.track.spec": mod,
        "system.secondary.animals.spec": mod, "system.secondary.appraisal.spec": mod, "system.secondary.architecture.spec": mod, "system.secondary.herballore.spec": mod,
        "system.secondary.history.spec": mod, "system.secondary.law.spec": mod, "system.secondary.magicappr.spec": mod, "system.secondary.medicine.spec": mod,
        "system.secondary.memorize.spec": mod, "system.secondary.navigation.spec": mod, "system.secondary.occult.spec": mod, "system.secondary.science.spec": mod,
        "system.secondary.tactics.spec": mod, "system.secondary.composure.spec": mod, "system.secondary.featsofstr.spec": mod, "system.secondary.withstpain.spec": mod,
        "system.secondary.disguise.spec": mod, "system.secondary.hide.spec": mod, "system.secondary.lockpicking.spec": mod, "system.secondary.poisons.spec": mod,
        "system.secondary.stealth.spec": mod, "system.secondary.theft.spec": mod, "system.secondary.traplore.spec": mod, "system.secondary.alchemy.spec": mod,
        "system.secondary.animism.spec": mod, "system.secondary.art.spec": mod, "system.secondary.dance.spec": mod, "system.secondary.forging.spec": mod,
        "system.secondary.jewelry.spec": mod, "system.secondary.music.spec": mod, "system.secondary.runes.spec": mod, "system.secondary.ritualcalig.spec": mod,
        "system.secondary.slofhand.spec": mod, "system.secondary.tailoring.spec": mod, "system.secondary.piloting.spec": mod, "system.secondary.cooking.spec": mod,
        "system.secondary.technomagic.spec": mod, "system.secondary.toymaking.spec": mod, "system.secondary.kidetection.spec": mod, "system.secondary.kiconceal.spec": mod
    })
}

export async function openSpendKiWindow(actorData) {

}