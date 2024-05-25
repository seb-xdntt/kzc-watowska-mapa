#%%
s = input("nazwa/numer budynku")

#%%
budynekwords = ["budynek", "bud", "bud.", "b", "b."]
sztabwords =["100","s","s.", "sz","sz.", "sztab"]
akademik_wojskowywords = ["aw","aw.","akademik"]
stolowka_wojskowawords = ["sw","sw.", "stolowka","stołówka", "stolówka", "stołowka"]
bibliotekawords = ["biblioteka","biblio","bg"]
#%%
def findNumber(List):
    for i in List:
        if i.isnumeric():
            return i
    return "chuj, kurwa, nie działa"

def joinList(List):
    #print(f"joinlist lista: {List}")
    for i in List:
        if not i.isalnum():
            return ValueError
    outputString = " ".join(List)
    return outputString

def strNum(string):
    #print(f"strNum string: {string}")
    if string.isnumeric():
        #print(1)
        return 1
    if string.isalpha():
        #print(2)
        return 2
    else:
        #print(0)
        return 0

def sigmaBalls(List):
    #print(f"sigmaballs lista input: {List}")
    i=0
    while i < len(List):
        if List[i].isalpha()==False and List[i].isnumeric()==False:
            s = str(List[i])
            #print(f"notapha: {s}")
            if len(List[i])==1 and not List[i].isalnum():
                List.remove(List[i])
            else:
                for j in range(len(List[i])-1):
                    if strNum(s[j])!=strNum(s[j+1]):
                        #print("sj+1",s[j+1])
                        #print("typecheck failed")
                        #print(f"j: {j}, i[j]: {List[i][j]}")
                        List[i],helper = List[i][:j+1],List[i][j+1:]
                        List.insert(i+1,helper)
                        #print(f"SigmaBalls Lista: {List}")
                        #print(f"i: {i}")
                        break


        else: i+=1
    #print(List)
    return List

#%%
def Translator(inputString):
    outputString = inputString.strip()
    outputString = outputString.casefold()
    List  = outputString.split()
    sigmaBalls(List)
    #print(f"lista{List}")
    for i in List:
        if(i in budynekwords):
            List.remove(i)
            return findNumber(List)
        if i in akademik_wojskowywords:
            List = ["aw",findNumber(List)]
            break
        if i in stolowka_wojskowawords:
            List = ["sw",findNumber(List)]
            break
        if i in sztabwords:
            return "100"
        if i in bibliotekawords:
            return "bg"

    outputString = joinList(List)
    return outputString

s= "100"
print(f"outputstring: {Translator(s)}")
# %%
