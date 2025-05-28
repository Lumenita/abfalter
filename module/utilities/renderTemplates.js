export const renderTemplates = (...templates) => {
    return Promise.all(templates.map(template => foundry.applications.handlebars.renderTemplate(template.name, template.context ?? {})));
};
