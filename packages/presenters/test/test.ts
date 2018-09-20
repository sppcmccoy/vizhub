import * as assert from 'assert';
import { testData } from 'datavis-tech-entities';
import { VisualizationViewModel, DatasetViewModel } from '../src';
import { bundle } from '../src';

const {
  visualization,
  dataset
} = testData;

describe('Presenters', () => {
  describe('VisualizationViewModel', () => {
    it('should present a Visualization', () => {
      assert.deepEqual(new VisualizationViewModel(visualization), {
        id: visualization.id,
        files: visualization.content.files,
        title: "Foo",
        width: 960,
        height: 600
      });
    });
  });

  describe('DatasetViewModel', () => {
    it('should present a Dataset', () => {
      assert.deepEqual(new DatasetViewModel(dataset), {
        title: "Foo",
        slug: "foo",
        format: "csv",
        sourceName: "Flaring Central",
        sourceUrl: "https://flaring.central/",
        text: "a,b,c\n1,2,3\n4,5,6"
      });
    });
  });

  describe('Bundler', () => {
    it('should bundle files using Rollup', async () => {
      const files = [
        { name: 'index.js', text: 'import { foo } from "./foo.js"; console.log(foo);' },
        { name: 'foo.js', text: 'export const foo = "bar";' }
      ];
      assert.deepEqual(await bundle(files), [{
        name: 'bundle.js',
        text: "(function () {\n\t'use strict';\n\n\tconst foo = \"bar\";\n\n\tconsole.log(foo);\n\n}());\n"
      }]);
    });

    it('should refer to global d3 in bundle for d3 package', async () => {
      const files = [
        { name: 'index.js', text: 'import { select } from "d3"; console.log(select);' }
      ];
      assert.deepEqual(await bundle(files), [{
        name: 'bundle.js',
        text: "(function (d3) {\n\t'use strict';\n\n\tconsole.log(d3.select);\n\n}(d3));\n"
      }]);
    });

    it('should refer to global d3 in bundle for d3 package', async () => {
      const files = [
        { name: 'index.js', text: 'import { select } from "d3"; console.log(select);' }
      ];
      assert.deepEqual(await bundle(files), [{
        name: 'bundle.js',
        text: "(function (d3) {\n\t'use strict';\n\n\tconsole.log(d3.select);\n\n}(d3));\n"
      }]);
    });
  });
});
