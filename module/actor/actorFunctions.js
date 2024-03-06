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
        "data.secondary.acrobatics.temp": mod, "data.secondary.athleticism.temp": mod, "data.secondary.climb.temp": mod, "data.secondary.jump.temp": mod,
        "data.secondary.ride.temp": mod, "data.secondary.swim.temp": mod, "data.secondary.etiquette.temp": mod, "data.secondary.intimidate.temp": mod,
        "data.secondary.leadership.temp": mod, "data.secondary.persuasion.temp": mod, "data.secondary.streetwise.temp": mod, "data.secondary.style.temp": mod,
        "data.secondary.trading.temp": mod, "data.secondary.notice.temp": mod, "data.secondary.search.temp": mod, "data.secondary.track.temp": mod,
        "data.secondary.animals.temp": mod, "data.secondary.appraisal.temp": mod, "data.secondary.architecture.temp": mod, "data.secondary.herballore.temp": mod,
        "data.secondary.history.temp": mod, "data.secondary.law.temp": mod, "data.secondary.magicappr.temp": mod, "data.secondary.medicine.temp": mod,
        "data.secondary.memorize.temp": mod, "data.secondary.navigation.temp": mod, "data.secondary.occult.temp": mod, "data.secondary.science.temp": mod,
        "data.secondary.tactics.temp": mod, "data.secondary.composure.temp": mod, "data.secondary.featsofstr.temp": mod, "data.secondary.withstpain.temp": mod,
        "data.secondary.disguise.temp": mod, "data.secondary.hide.temp": mod, "data.secondary.lockpicking.temp": mod, "data.secondary.poisons.temp": mod,
        "data.secondary.stealth.temp": mod, "data.secondary.theft.temp": mod, "data.secondary.traplore.temp": mod, "data.secondary.alchemy.temp": mod,
        "data.secondary.animism.temp": mod, "data.secondary.art.temp": mod, "data.secondary.dance.temp": mod, "data.secondary.forging.temp": mod,
        "data.secondary.jewelry.temp": mod, "data.secondary.music.temp": mod, "data.secondary.runes.temp": mod, "data.secondary.ritualcalig.temp": mod,
        "data.secondary.slofhand.temp": mod, "data.secondary.tailoring.temp": mod, "data.secondary.piloting.temp": mod, "data.secondary.cooking.temp": mod,
        "data.secondary.technomagic.temp": mod, "data.secondary.toymaking.temp": mod, "data.secondary.kidetection.temp": mod, "data.secondary.kiconceal.temp": mod
    })
}

export async function changeSecondarySpecs(actorData) {
    const mod = await openOneModDialog() || 0;

    actorData.update({
        "data.secondary.acrobatics.spec": mod, "data.secondary.athleticism.spec": mod, "data.secondary.climb.spec": mod, "data.secondary.jump.spec": mod,
        "data.secondary.ride.spec": mod, "data.secondary.swim.spec": mod, "data.secondary.etiquette.spec": mod, "data.secondary.intimidate.spec": mod,
        "data.secondary.leadership.spec": mod, "data.secondary.persuasion.spec": mod, "data.secondary.streetwise.spec": mod, "data.secondary.style.spec": mod,
        "data.secondary.trading.spec": mod, "data.secondary.notice.spec": mod, "data.secondary.search.spec": mod, "data.secondary.track.spec": mod,
        "data.secondary.animals.spec": mod, "data.secondary.appraisal.spec": mod, "data.secondary.architecture.spec": mod, "data.secondary.herballore.spec": mod,
        "data.secondary.history.spec": mod, "data.secondary.law.spec": mod, "data.secondary.magicappr.spec": mod, "data.secondary.medicine.spec": mod,
        "data.secondary.memorize.spec": mod, "data.secondary.navigation.spec": mod, "data.secondary.occult.spec": mod, "data.secondary.science.spec": mod,
        "data.secondary.tactics.spec": mod, "data.secondary.composure.spec": mod, "data.secondary.featsofstr.spec": mod, "data.secondary.withstpain.spec": mod,
        "data.secondary.disguise.spec": mod, "data.secondary.hide.spec": mod, "data.secondary.lockpicking.spec": mod, "data.secondary.poisons.spec": mod,
        "data.secondary.stealth.spec": mod, "data.secondary.theft.spec": mod, "data.secondary.traplore.spec": mod, "data.secondary.alchemy.spec": mod,
        "data.secondary.animism.spec": mod, "data.secondary.art.spec": mod, "data.secondary.dance.spec": mod, "data.secondary.forging.spec": mod,
        "data.secondary.jewelry.spec": mod, "data.secondary.music.spec": mod, "data.secondary.runes.spec": mod, "data.secondary.ritualcalig.spec": mod,
        "data.secondary.slofhand.spec": mod, "data.secondary.tailoring.spec": mod, "data.secondary.piloting.spec": mod, "data.secondary.cooking.spec": mod,
        "data.secondary.technomagic.spec": mod, "data.secondary.toymaking.spec": mod, "data.secondary.kidetection.spec": mod, "data.secondary.kiconceal.spec": mod
    })
}

export async function openSpendKiWindow(actorData) {

}