export const renderTemplates = (...templates) => {
    return Promise.all(templates.map(template => renderTemplate(template.name, template.context ?? {})));
};
