import { useRef, useState, createElement } from 'react';
import { Panel, PanelBody, TextareaControl, Button, TabPanel, SelectControl, Toolbar, ToolbarButton, ToolbarGroup, ToolbarItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';

import validator from '@rjsf/validator-ajv8';
import FormGutenberg/*, { withTheme, getDefaultRegistry }*/ from '@cfhack2024-wp-react-jsonschema-form/rjsf-renderer/gutenberg';
import FormHtml5/*, { withTheme, getDefaultRegistry }*/ from '@cfhack2024-wp-react-jsonschema-form/rjsf-renderer/html5';

import STORE_KEY from './playground-store.js';

import SplitPane, {
  Divider,
  SplitPaneBottom,
  SplitPaneLeft,
  SplitPaneRight,
  SplitPaneTop,
} from "./split-pane.js";

import './playground.scss';

const config = window['rjsf-renderer-playground'];

function SourceEditor() {
  const { schema } = useSelect((select) => {
    const store = select(STORE_KEY);
    return {
      schema: store.getSchema(),
    };
  });
  const { setSchema } = useDispatch(STORE_KEY);

  const [ intermediateValue, setIntermediateValue ] = useState(JSON.stringify( JSON.parse(schema), null, 2));
  const textareaRef = useRef();

  const onChange = (value) => {
    try {
      const object = JSON.parse(value);
      setSchema( JSON.stringify(object));
      textareaRef.current?.setCustomValidity('');
    } catch(ex) {
      textareaRef.current?.setCustomValidity(ex.message);
    }
    setIntermediateValue(value);
  };

  return (
    <TextareaControl
      className="rjsf-renderer-playground-jsoneditor"
      label={ __( 'JSON Schema', 'rjsf-renderer-playground' ) }
      help={ __("This textarea acts as a placeholder for the JSON Schema source editor to be rendered.", 'rjsf-renderer-playground') }
      value={ intermediateValue }
      ref={ textareaRef }
      rows={ 20 }
      onChange={ onChange }
    />
  );
}

function JSONSchemaEditor() {
  return (
    <TabPanel
      tabs={ [
        {
          name: 'source-editor',
          title: __('JSON Schema Source', 'rjsf-renderer-playground')
        },
        {
          name: 'graphical-editor',
          title: __('JSON Schema graphical editor', 'rjsf-renderer-playground'),
        },
      ] }
    >
      {
        (tab) => {
          switch(tab.name) {
            case 'source-editor' :
              return (<SourceEditor/>)
            case 'graphical-editor' :
              return ( <pre style={{ color : 'red' }}>NOT YET IMPLEMENTED</pre> );
          }
        }
      }
    </TabPanel>
  );
}

function JSONSchemaUIEditor() {
  const { uiSchema } = useSelect((select) => {
    const store = select(STORE_KEY);
    return {
      uiSchema: store.getUISchema(),
    };
  });
  const { setUISchema } = useDispatch(STORE_KEY);

  const [ intermediateValue, setIntermediateValue ] = useState(JSON.stringify( JSON.parse( uiSchema), null, 2));
  const textareaRef = useRef();

  const onChange = (value) => {
    try {
      const object = JSON.parse(value);
      setUISchema( JSON.stringify(object));
      textareaRef.current?.setCustomValidity('');
    } catch(ex) {
      textareaRef.current?.setCustomValidity(ex.message);
    }
    setIntermediateValue(value);
  };

  return (
    <TextareaControl
      className="rjsf-renderer-playground-jsoneditor"
      label={ __( 'UISchema', 'rjsf-renderer-playground' ) }
      help={ __("This textarea acts as a placeholder for the UI Schema editor.", 'rjsf-renderer-playground') }
      value={ intermediateValue }
      ref={ textareaRef }
      rows={ 20 }
      onChange={ onChange }
    />
  );
}

function Preview() {
  const { schema, uiSchema, renderer, isPreviewLiveValidate } = useSelect((select) => {
    const store = select(STORE_KEY);
    return {
      schema: store.getSchema(),
      uiSchema: store.getUISchema(),
      renderer: store.getRenderer(),
      isPreviewLiveValidate : store.isPreviewLiveValidate(),
    };
  });
  const { setRenderer, setPreviewLiveValidate } = useDispatch(STORE_KEY);

  return (
    <div className="rjsf-preview">
      <Toolbar label="preview toolbar">
        <ToolbarGroup>
          <ToolbarButton
            text={ __('Live validation', 'rjsf-renderer-playground') }
            isPressed={isPreviewLiveValidate}
            onClick={() => setPreviewLiveValidate(!isPreviewLiveValidate) }
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarButton
            text={ __('Renderer: ', 'rjsf-renderer-playground') }
            disabled
          />
          <ToolbarButton
            text={ __('Gutenberg', 'rjsf-renderer-playground') }
            isPressed={renderer==='gutenberg'}
            onClick={() => setRenderer('gutenberg') }
          />
          <ToolbarButton
            text={ __('HTML5', 'rjsf-renderer-playground') }
            isPressed={renderer==='html5'}
            onClick={() => setRenderer('html5') }
          />
        </ToolbarGroup>
      </Toolbar>
      <div className="rjsf-preview-container">
        {
          createElement(renderer==='gutenberg' ? FormGutenberg : FormHtml5, { schema : JSON.parse(schema), uiSchema : JSON.parse(uiSchema), validator, liveValidate : isPreviewLiveValidate})
        }
      </div>
    </div>
  );
}


export default function Playground() {
  return (
    <Panel header="rjsf-renderer-playground">
      <PanelBody title={ __('Playground', 'rjsf-renderer-playground') } opened>
        <SplitPane className="split-pane-row">
          <SplitPaneLeft>

            <SplitPane className="split-pane-col">
              <SplitPaneTop>
                <JSONSchemaEditor/>
              </SplitPaneTop>
              <Divider className="separator-row" />
              <SplitPaneBottom>
                <JSONSchemaUIEditor/>
              </SplitPaneBottom>
            </SplitPane>

          </SplitPaneLeft>
          <Divider className="separator-col" />
          <SplitPaneRight>
            <Preview/>
          </SplitPaneRight>
        </SplitPane>
      </PanelBody>
    </Panel>
  );
}
