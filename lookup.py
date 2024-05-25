import filtr
import pandas as pd
from IPython.display import display
print(filtr.main("b55"))
Df = pd.read_csv("./budynki.csv", on_bad_lines='warn',sep=";")
#print(Df)
display(Df)
