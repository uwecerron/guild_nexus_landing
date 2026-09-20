from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
S=2
im=Image.new('RGB',(1200*S,630*S),'#f6f5f0'); d=ImageDraw.Draw(im)
def font(size,serif=False,bold=False):
 name='Georgia.ttf' if serif else ('Arial Bold.ttf' if bold else 'Arial.ttf')
 return ImageFont.truetype('/System/Library/Fonts/Supplemental/'+name,size*S)
def text(x,y,t,size,color='#202c2b',serif=False,bold=False):d.text((x*S,y*S),t,font=font(size,serif,bold),fill=color)
def line(coords,color,width=1):d.line(tuple(v*S for v in coords),fill=color,width=width*S)
def box(coords,fill,r=14,outline=None):d.rounded_rectangle(tuple(v*S for v in coords),r*S,fill=fill,outline=outline,width=S)
text(64,47,'NEXUS',26,bold=True);text(184,54,'/  TRADERS GUILD',16,'#65776d')
line((64,105,1136,105),'#daddd2')
text(64,151,'Keep your business',54,serif=True)
text(64,221,'follow-ups moving.',54,'#477459',serif=True)
text(66,319,'Conversation notes. Your next message.',23,'#5b6863')
text(66,355,'A clear view of who you’re waiting on.',23,'#5b6863')
box((66,433,340,488),'#244d3c',9)
text(88,449,'Your next step, in one place.',17,'#ffffff')
box((770,151,1136,489),'#ffffff',18,'#dde2d8')
text(798,179,'YOUR NEXT STEPS',14,'#65776d',bold=True)
for i,(label,status) in enumerate([('Send the updated deck','Ready to follow up'),('Check in with a partner','Waiting for reply'),('Make the introduction','Next conversation')]):
 y=222+i*82
 if i:line((798,y-13,1108,y-13),'#e8ebe3')
 box((798,y+2,824,y+28),'#edf2e9',13)
 text(804,y+5,str(i+1),14,'#477459',bold=True)
 text(838,y,label,18,bold=True);text(838,y+30,status,15,'#697971')
line((64,545,1136,545),'#daddd2')
text(64,568,'nexus.tradersguild.global',20,'#244d3c',bold=True)
text(936,572,'BUILT FOR THE GUILD',13,'#65776d')
im.resize((1200,630),Image.Resampling.LANCZOS).save(Path(__file__).resolve().parents[1]/'nexus-social-v1.png',optimize=True)
