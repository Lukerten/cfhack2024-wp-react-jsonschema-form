import { getTemplate, getUiOptions, } from '@rjsf/utils';
import Label from './Label';
/** The `FieldTemplate` component is the template used by `SchemaField` to render any field. It renders the field
 * content, (label, description, children, errors and help) inside of a `WrapIfAdditional` component.
 *
 * @param props - The `FieldTemplateProps` for this component
 */
export default function FieldTemplate(props) {
    const { id, label, children, errors, help, description, hidden, required, displayLabel, registry, uiSchema } = props;
    const uiOptions = getUiOptions(uiSchema, registry.globalUiOptions);
    const WrapIfAdditionalTemplate = getTemplate('WrapIfAdditionalTemplate', registry, uiOptions);
    if (hidden) {
        return <div className='hidden'>{children}</div>;
    }
    return (<WrapIfAdditionalTemplate {...props}>
      {children}
      {errors}
      {help}
    </WrapIfAdditionalTemplate>);
}
