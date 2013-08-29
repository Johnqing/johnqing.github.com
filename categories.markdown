---
layout: default
title: johnqing's masterplan
cats:
    - id: f2e
      url: /f2e/
    - id: js
      url: /js/
    - id: css
      url: /style/
    - id: readbook
      url: /readbook/
---
Archive :: categories {#archive}
=====================
{% for cat in page.cats %}
[{{ cat.id }}]({{ cat.url }}){:.category} {#{{ cat.id }}}
-----------------------------
{% for post in site.categories[cat.id] %}
* <span>{{ post.date | date_to_string }}</span> &#187; [{{ post.title }}]({{ post.url }})
{:.posts}
{% endfor %}
{% endfor %}
