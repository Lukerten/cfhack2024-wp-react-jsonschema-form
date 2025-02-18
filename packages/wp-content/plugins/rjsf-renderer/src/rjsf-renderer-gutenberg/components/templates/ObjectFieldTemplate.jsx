import { canExpand, descriptionId, getTemplate, getUiOptions, titleId, } from '@rjsf/utils';
/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function ObjectFieldTemplate(props) {
    const { description, disabled, formData, idSchema, onAddClick, properties, readonly, registry, required, schema, title, uiSchema, } = props;
    const options = getUiOptions(uiSchema, registry.globalUiOptions);
    const TitleFieldTemplate = getTemplate('TitleFieldTemplate', registry, options);
    const DescriptionFieldTemplate = getTemplate('DescriptionFieldTemplate', registry, options);
    // Button templates are not overridden in the uiSchema
    const { ButtonTemplates: { AddButton }, } = registry.templates;
    return (<fieldset id={idSchema.$id}>
      {title && (<TitleFieldTemplate id={titleId(idSchema)} title={title} required={required} schema={schema} uiSchema={uiSchema} registry={registry}/>)}
      {description && (<DescriptionFieldTemplate id={descriptionId(idSchema)} description={description} schema={schema} uiSchema={uiSchema} registry={registry}/>)}
      {properties.map((prop) => prop.content)}
      {canExpand(schema, uiSchema, formData) && (<AddButton className='object-property-expand' onClick={onAddClick(schema)} disabled={disabled || readonly} uiSchema={uiSchema} registry={registry}/>)}
    </fieldset>);
}
