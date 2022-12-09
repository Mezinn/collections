import {
  bool,
  filter,
  must,
  nestedMatch,
  nestedMatchPhrase,
  should,
} from '../../packages/search';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class SearchModel {
  private _query: {
    subject: string[];
    date: string[];
    basicSearch: string[];
    culturalContext: string[];
    description: string[];
    material: string[];
    provenance: string[];
    source: string[];
    stylePeriod: string[];
    technique: string[];
    title: string[];
    agent: string[];
  };
  private _filter: {
    source: string[];
    workType: string[];
  };

  public constructor() {
    this._query = {
      subject: [],
      date: [],
      basicSearch: [],
      culturalContext: [],
      description: [],
      material: [],
      provenance: [],
      source: [],
      stylePeriod: [],
      technique: [],
      title: [],
      agent: [],
    };
    this._filter = {
      source: [],
      workType: [],
    };
  }

  public query() {
    const context = {
      getBasicSearch: () => {
        return this._query.basicSearch;
      },
      basicSearch: (...values: string[]) => {
        this._query.basicSearch = values;
        return context;
      },
      culturalContext: (...values: string[]) => {
        this._query.culturalContext = values;
        return context;
      },
      description: (...values: string[]) => {
        this._query.description = values;
        return context;
      },
      material: (...values: string[]) => {
        this._query.material = values;
        return context;
      },
      provenance: (...values: string[]) => {
        this._query.provenance = values;
        return context;
      },
      subject: (...values: string[]) => {
        this._query.subject = values;
        return context;
      },
      source: (...values: string[]) => {
        this._query.source = values;
        return context;
      },
      stylePeriod: (...values: string[]) => {
        this._query.stylePeriod = values;
        return context;
      },
      date: (...values: string[]) => {
        this._query.date = values;
        return context;
      },
      technique: (...values: string[]) => {
        this._query.technique = values;
        return context;
      },

      title: (...values: string[]) => {
        this._query.title = values;
        return context;
      },
      agent: (...values: string[]) => {
        this._query.agent = values;
        return context;
      },
    };
    return context;
  }

  public filter() {
    const context = {
      source: (...values: string[]) => {
        this._filter.source = values;
        return context;
      },
      workType: (...values: string[]) => {
        this._filter.workType = values;
        return context;
      },
    };
    return context;
  }

  public getQuery() {
    return [
      bool(
        must(
          // basicSearch
          bool(
            should(
              nestedMatch('title', 'title.value', this._query.basicSearch),
              nestedMatch(
                'description',
                'description.value',
                this._query.basicSearch,
              ),
              nestedMatch(
                'agent',
                'agent.value.value',
                this._query.basicSearch,
              ),
              nestedMatch('agent', 'agent.role.value', this._query.basicSearch),
            ),
          ),
          // culturalContext
          bool(
            should(
              nestedMatch(
                'culturalContext',
                'culturalContext.value',
                this._query.culturalContext,
              ),
            ),
          ),
          // description
          bool(
            should(
              nestedMatch(
                'description',
                'description.value',
                this._query.description,
              ),
            ),
          ),
          // material
          bool(
            should(
              nestedMatch('material', 'material.value', this._query.material),
            ),
          ),
          // subject
          bool(
            should(
              nestedMatch('subject', 'subject.value', this._query.subject),
            ),
          ),
          // source
          bool(
            should(nestedMatch('source', 'source.value', this._query.source)),
          ),
          // date
          bool(should(nestedMatch('date', 'date.value', this._query.date))),
          // technique
          bool(
            should(
              nestedMatch(
                'technique',
                'technique.value',
                this._query.technique,
              ),
            ),
          ),
          // title
          bool(should(nestedMatch('title', 'title.value', this._query.title))),
          // agent
          bool(
            should(
              nestedMatch('agent', 'agent.value.value', this._query.agent),
            ),
          ),
        ),
        filter(
          // source
          bool(
            should(
              nestedMatchPhrase('source', 'source.value', this._filter.source),
            ),
          ),
          // worktype
          bool(
            should(
              nestedMatchPhrase(
                'worktype',
                'worktype.value',
                this._filter.workType,
              ),
            ),
          ),
        ),
      ),
    ];
  }
}
