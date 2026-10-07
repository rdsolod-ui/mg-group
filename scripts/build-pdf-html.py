"""Prepare a static, Arabic-first print edition from the exported presentation."""
from pathlib import Path
from lxml import html,etree
import json
root=Path(__file__).resolve().parents[1]
doc=html.parse(str(root/'out/index.html'))
def cls(name):return doc.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," '+name+' ")]')
def remove(nodes):
 for n in nodes:
  if n.getparent() is not None:n.getparent().remove(n)
remove(doc.xpath('//script|//noscript|//link[@rel="preload"]|//dialog'))
for c in ['header','skip','deck-controls','presentation-controls','chapter-menu','media-loading','media-error','image-expand','gallery-open','project-media-tabs','skazka-slide-navigation','assembly-controls','assembly-focus','globe-help','globe-destination','model-download','primary-button','text-button']:
 remove(cls(c))
# Remove the site's fixed bottom controls, keeping semantic chapter content.
experience=cls('experience')[0]
for n in list(experience):
 if n.tag!='main':experience.remove(n)
registry=json.loads((root/'src/data/optimized-media.json').read_text('utf-8'))
by_preview={e['preview']:(k,e) for k,e in registry.items()}
by_variant={'/mg-group/'+v['src']:(k,e) for k,e in registry.items() for v in e['variants']}
for n in cls('progressive-media'):
 n.set('data-load-state','loaded')
 for img in n.xpath('.//img'):
  src=img.get('src','');entry=by_preview.get(src) or by_variant.get(src)
  if entry:
   _,e=entry;v=next(v for v in e['variants'] if v['format']=='webp' and v['width']==960)
   img.set('src','/mg-group/'+v['src'])
  for attr in ['srcset','sizes','fetchpriority']:img.attrib.pop(attr,None)
remove(doc.xpath('//picture/source'))
for img in doc.xpath('//img'):
 img.set('loading','eager');img.set('decoding','sync')
for n in doc.xpath('//*[@data-attraction-video]'):
 slug=n.get('data-attraction-video');n.clear();n.set('class','pdf-ride-poster')
 n.append(html.Element('img',src='/mg-group/ride-videos/'+slug+'/poster.webp',alt='Attraction film still'))
 link=html.Element('a',href='https://marketing.parkskazka.ru/mg-group/#ride-models');link.text='شاهد الفيديو على الموقع · Watch the film online';n.append(link)
for n in doc.xpath('//button'):
 for attr in ['type','tabindex','aria-pressed','disabled']:n.attrib.pop(attr,None)
for a in doc.xpath('//a[@href]'):
 href=a.get('href')
 if href.startswith('/mg-group/'):a.set('href','https://marketing.parkskazka.ru'+href)
 elif href.startswith('#'):a.set('href','https://marketing.parkskazka.ru/mg-group/'+href)
chapters=cls('chapter');assert len(chapters)==21
for i,section in enumerate(chapters,1):
 section.attrib.pop('style',None);section.attrib.pop('inert',None)
 brand=html.Element('div',attrib={'class':'pdf-page-brand'});brand.append(html.Element('img',src='/mg-group/brand/mg-group-white.svg',alt='MG Group'));section.insert(0,brand)
 footer=html.Element('div',attrib={'class':'pdf-page-footer'});footer.text=f'MG GROUP · ENGINEERING & OPERATIONS                                    07 OCT 2026                                        {i:02d} / 21';section.append(footer)
style=html.Element('style');style.text=(root/'scripts/pdf-edition.css').read_text('utf-8');doc.getroot().find('head').append(style)
doc.getroot().find('head/title').text='MG Group — Corporate Presentation'
meta=html.Element('meta',name='robots',content='noindex,nofollow');doc.getroot().find('head').append(meta)
(root/'out/pdf-preview.html').write_bytes(html.tostring(doc,encoding='utf-8',doctype='<!DOCTYPE html>'))
print('21 static chapters prepared at /mg-group/pdf-preview.html')
