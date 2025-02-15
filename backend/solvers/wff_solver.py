#Inputs are the same as propositional_solver.py. A > B, A v B, A ^ B, (A > B) v (C ^ D), but there's also <> now

import math
letters = []
hypothesi = []
truthTable = []

class Letter:
    def __init__(self, letter, parent1, parent2, typeOfGetThere, is_Not, istrue):
        self.letter = letter
        self.is_Not = is_Not
        self.istrue = istrue
        self.parent1 = parent1
        self.parent2 = parent2
        self.type = typeOfGetThere
    
    def __eq__(self, value):
        # Check if the value is a Letter object or a string
        if isinstance(value, Letter):
            return self.letter == value.letter
        return self.letter == value  # Compare with string if value is not a Letter
    
    # Override the >= operator
    def __ge__(self, value):
        # Check if the value is a Letter object or a string
        if isinstance(value, Letter):
            return self.letter == value.letter and self.is_Not == value.is_Not
        return False  # If string, compare letter only and assume 'not' is False

    def __str__(self):
        if self.is_Not == False:
            return self.letter
        elif self.is_Not == True:
            return "not " + self.letter
        else:
            return self.letter + "is acting weird"
        
    def checkTrue(self):
        for i, j in enumerate(letters):
            if j == self.letter:
                if not self.is_Not:
                    if truthTable[i] == "T":
                        return True
                    return False
                else:
                    if truthTable[i] == "F":
                        return True
                    return False

        
    def clone(self):
        return Letter(self.letter, self.parent1, self.parent2, self.type, self.is_Not, self.istrue)

class OR:
    def __init__(self, letter1, letter2, parent1, parent2, typeOfGetThere, is_Not):
        
        self.letter1 = letter1
        self.letter2 = letter2
        self.parent1 = parent1
        self.parent2 = parent2
        self.type = typeOfGetThere
        self.is_Not = is_Not

    def __str__(self):
        if not self.is_Not:
            return f"{self.letter1} or {self.letter2}"
        return f"not ({self.letter1} or {self.letter2})"
    
    def __eq__(self, value):
        if isinstance(value, OR):
            # Compare using Letter instances directly
            return ((self.letter1 >= value.letter1 and self.letter2 >= value.letter2) or
                    (self.letter1 >= value.letter2 and self.letter2 >= value.letter1)) and self.is_Not == value.is_Not
        return False
    
    def __ge__(self, value):
        return self == value
    
    def checkTrue(self):
        return self.letter1.checkTrue() or self.letter2.checkTrue()
    
    def clone(self):
        return OR(self.letter1.clone(), self.letter2.clone(), self.parent1, self.parent2, self.type, self.is_Not)


class IMPLIES:
    def __init__(self, letter1, letter2, parent1=None, parent2=None, typeOfGetThere=None, is_Not=False):
        self.letter1 = letter1
        self.letter2 = letter2
        self.parent1 = parent1
        self.parent2 = parent2
        self.type = typeOfGetThere
        self.is_Not = is_Not

    def __str__(self):
        return f"{self.letter1} implies {self.letter2}"
    
    def __eq__(self, value):
        if isinstance(value, IMPLIES):
            return self.letter1 >= value.letter1 and self.letter2 >= value.letter2 and self.is_Not == value.is_Not
        return False
    
    def __ge__(self, value):
        return self == value
    
    def checkTrue(self):
        return self.letter2.checkTrue() or not self.letter1.checkTrue()
    
    def clone(self):
        return IMPLIES(self.letter1.clone(), self.letter2.clone(), self.parent1, self.parent2, self.type, self.is_Not)

class DIMPLIES:
    def __init__(self, letter1, letter2, parent1=None, parent2=None, typeOfGetThere=None, is_Not=False):
        self.letter1 = letter1
        self.letter2 = letter2
        self.parent1 = parent1
        self.parent2 = parent2
        self.type = typeOfGetThere
        self.is_Not = is_Not

    def __str__(self):
        return f"{self.letter1} iff {self.letter2}"
    
    def __eq__(self, value):
        if isinstance(value, DIMPLIES):
            return self.letter1 >= value.letter1 and self.letter2 >= value.letter2 and self.is_Not == value.is_Not
        return False
    
    def __ge__(self, value):
        return self == value
    
    def checkTrue(self):
        return (self.letter2.checkTrue() and self.letter1.checkTrue()) or (not self.letter2.checkTrue() and not self.letter1.checkTrue())
    
    def clone(self):
        return DIMPLIES(self.letter1.clone(), self.letter2.clone(), self.parent1, self.parent2, self.type, self.is_Not)

class AND:
    def __init__(self, letter1, letter2, parent1, parent2, typeOfGetThere, is_Not):
        
        self.letter1 = letter1
        self.letter2 = letter2
        self.parent1 = parent1
        self.parent2 = parent2
        self.type = typeOfGetThere
        self.is_Not = is_Not

    def __str__(self):
        base_str = f"{self.letter1} and {self.letter2}"
        return f"not ({base_str})" if self.is_Not else base_str
    
    def __eq__(self, value):
        if isinstance(value, AND):
            return ((self.letter1 >= value.letter1 and self.letter2 >= value.letter2) or
                    (self.letter1 >= value.letter2 and self.letter2 >= value.letter1)) and self.is_Not == value.is_Not
        return False
    
    def __ge__(self, value):
        return self == value
    
    def checkTrue(self):
        return self.letter1.checkTrue() and self.letter2.checkTrue()

    def clone(self):
        return AND(self.letter1.clone(), self.letter2.clone(), self.parent1, self.parent2, self.type, self.is_Not)
# backend/solvers/wff_solver.py

def solve(data):
    hypothisis = data.replace(" ", "")
    hypothisises = []

    parserString = ""
    inThing = 0
    for index, char in enumerate(hypothisis):
        if char == "(":
            inThing += 1
        if char == ")":
            inThing -= 1
        if char == "^" and inThing <= 0:
            hypothisises.append(parserString)
            parserString = ""
        else:
            parserString += char
        
    if parserString != "":
        hypothisises.append(parserString)


    def parse_and(component):
        ore = "v" in component
        andy = "^" in component
        imp = ">" in component
        dimp = "<>" in component
        wholeisNot = ")'" in component
        component = component.replace("(", "").replace(")'", "").replace(")", "")
        coms = [component]
        if ore:
            coms = component.split("v")
        if andy:
            coms = component.split("^")
        if imp:
            coms = component.split(">")
        if dimp:
            coms = component.cplit("<>")
        isnt = "'" in coms[0]
        base_letter = coms[0].replace("'", "")
        letter1 = Letter(base_letter, "hypothesis", "hypothesis", "none", isnt, "unknown")
        letter2 = "none"
        if coms.__len__() > 1 and coms[1] != "":  
            isnt2 = "'" in coms[1]
            base_letter = coms[1].replace("'", "")
            letter2 = Letter(base_letter, "hypothesis", "hypothesis", "none", isnt2, "unknown") 
        if isinstance(letter1, Letter) and letter1 not in letters:
            letters.append(letter1)
        if isinstance(letter2, Letter) and letter2 not in letters:
            letters.append(letter2)
        if ore:
            return OR(letter1, letter2, "none", "none", "none", wholeisNot)
        elif andy:
            return AND(letter1, letter2, "none", "none", "none", wholeisNot)
        elif imp:
            return IMPLIES(letter1, letter2, "none", "none", "none", wholeisNot)
        elif dimp:
            return DIMPLIES(letter1, letter2, "none", "none", "none", wholeisNot)
        else:
            return letter1

    def split_logic_string(i: str):
        result = []
        current = ""
        
        for index, char in enumerate(i):
            if char == '(':
                if current != "":
                    result.append(str(current))
                current = "("
            elif char == ')': 
                current += ")"
                result.append(str(current))
                current = ""
            elif char == "'" and current == "":
                holdUp = result.pop()
                holdUp += "'"
                result.append(holdUp)
            elif current == "" and char in {'>', 'v', '^'}:
                result.append(char)
            else:
                current += char
        
        if current != "":
            result.append(current)
        
        return result

    for i in hypothisises:

        if "(" in i and ")" in i:
            newEye = split_logic_string(i)
            if newEye.__len__() > 1:
                wholeNot = ")'" in newEye
                if not wholeNot:
                    finalEntry = newEye[newEye.__len__() - 1]
                    wholeNot = ")'" in finalEntry and finalEntry.replace(")'", "").__len__() == 1
                ore = "v" in newEye
                andy = "^" in newEye
                imp = ">" in newEye
                dimp = "<>" in newEye
                index = 0
                while newEye[index].replace("(", "").replace(")", "").replace("'", "").replace("v", "").replace("^", "").replace(">", "").replace("<", "") == "":
                    index += 1
                letter1 = parse_and(newEye[index])
                index += 1
                while newEye[index].replace("(", "").replace(")", "").replace("'", "").replace("v", "").replace("^", "").replace(">", "").replace("<", "") == "":
                    index += 1
                letter2 = parse_and(newEye[index])
                if not ore and not andy and not imp and not dimp:
                    if isinstance(letter1, OR):
                        newOR = OR(letter1.letter1, letter2, "hypothesis", "hypothesis", "none", wholeNot)
                        hypothesi.append(newOR)
                    if isinstance(letter1, AND):
                        newAND = AND(letter1.letter1, letter2, "hypothesis", "hypothesis", "none", wholeNot)
                        hypothesi.append(newAND)
                    if isinstance(letter1, IMPLIES):
                        newIMP = IMPLIES(letter1.letter1, letter2, "hypothesis", "hypotheis", "none", wholeNot)
                        hypothesi.append(newIMP)
                    if isinstance(letter1, DIMPLIES):
                        newIMP = DIMPLIES(letter1.letter1, letter2, "hypothesis", "hypotheis", "none", wholeNot)
                        hypothesi.append(newIMP)
                if ore:
                    newOR = OR(letter1, letter2, "hypothesis", "hypothesis", "none", wholeNot)
                    hypothesi.append(newOR)
                if andy:
                    newOR = AND(letter1, letter2, "hypothesis", "hypothesis", "none", wholeNot)
                    hypothesi.append(newOR)
                if imp:
                    newOR = IMPLIES(letter1, letter2, "hypothesis", "hypothesis", "none", wholeNot)
                    hypothesi.append(newOR)
                if dimp:
                    newOR = DIMPLIES(letter1, letter2, "hypothesis", "hypothesis", "none", wholeNot)
                    hypothesi.append(newOR)
            else:
                hypothisises.append(i.replace("(", ""))

        else:
            if "v" in i:  # Process OR
                components = i.split("v")
                letter1 = parse_and(components[0])  # Use parse_and for letter1
                letter2 = parse_and(components[1])  # Use parse_and for letter2

                is_not = False
                if isinstance(letter2, Letter):
                    is_not = i.endswith(")'")
                elif isinstance(letter2, AND):
                        if letter2.is_Not:
                            is_not = i.endswith(")')'")
                        else:
                            is_not = i.endswith(")'")
                newOr = OR(letter1, letter2, "hypothesis", "hypothesis", "none", is_not)
                hypothesi.append(newOr)
            elif "<>" in i:  # Process IMPLIES
                components = i.split("<>")
                letter1 = parse_and(components[0])  # Use parse_and for letter1
                letter2 = parse_and(components[1])  # Use parse_and for letter2

                is_not = False
                if isinstance(letter2, Letter):
                    is_not = i.endswith(")'")
                else:
                    if isinstance(letter2, AND):
                        if letter2.is_Not:
                            is_not = i.endswith(")')'")
                        else:
                            is_not = i.endswith(")'")
                newImplies = DIMPLIES(letter1, letter2, "hypothesis", "hypothesis", "none", is_not)
                hypothesi.append(newImplies)
            # Process IMPLIES
            elif ">" in i:  # Process IMPLIES
                components = i.split(">")
                letter1 = parse_and(components[0])  # Use parse_and for letter1
                letter2 = parse_and(components[1])  # Use parse_and for letter2

                is_not = False
                if isinstance(letter2, Letter):
                    is_not = i.endswith(")'")
                else:
                    if isinstance(letter2, AND):
                        if letter2.is_Not:
                            is_not = i.endswith(")')'")
                        else:
                            is_not = i.endswith(")'")
                newImplies = IMPLIES(letter1, letter2, "hypothesis", "hypothesis", "none", is_not)
                hypothesi.append(newImplies)
            elif "^" in i:  # AND statement
                components = i.replace("(", "").replace(")'", "").replace(")", "").split("^")
                wholeNot = ")'" in i
                letter1, letter2 = components[0], components[1]

                is_not_1 = "'" in letter1
                base_letter1 = letter1.replace("'", "")
                letter_obj1 = Letter(base_letter1, "hypothesis", "hypothesis", "none",  is_not_1, "unknown")
                if letter_obj1 not in letters:
                    letters.append(letter_obj1)
                if letter_obj1 not in hypothesi:
                    hypothesi.append(letter_obj1)

                is_not_2 = "'" in letter2
                base_letter2 = letter2.replace("'", "")
                letter_obj2 = Letter(base_letter2, "hypothesis", "hypothesis", "none",  is_not_2, "unknown")
                if letter_obj2 not in letters:
                    letters.append(letter_obj2)
                if letter_obj2 not in hypothesi:
                    hypothesi.append(letter_obj2)

                conclusion = AND(letter_obj1, letter_obj2, "conclusion", "conclusion", "none", False)
            else:  # Process single-letter hypothesis
                is_not = "'" in i
                base_letter = i.replace("'", "")
                newLetter = Letter(base_letter, "hypothesis", "hypothesis", "none",  is_not, not is_not)  # True for positive, False for negative
                if newLetter not in letters:
                    letters.append(newLetter)
                else:  # Update `istrue` if the letter already exists
                    for letter in letters:
                        if letter.letter == base_letter:
                            letter.istrue = not is_not
                hypothesi.append(newLetter)
    # Implement the WFF to truth table algorithm
    # This is just a placeholder implementation
    print([str(h) for h in hypothesi])
    print([str(l) for l in letters])
    outputStr = "|"
    noHypot = hypothesi.__len__()
    for l in letters:
        outputStr += " " + l.letter + " |"
        truthTable.append("T")
    hypotLs = []
    allHypothesi = []
    for h in hypothesi:
        if isinstance(h, Letter) or (isinstance(h.letter1, Letter) and isinstance(h.letter2, Letter)) and noHypot > 1:
            outputStr += " " + str(h) + " |"
            hypotLs.append(str(h).__len__())
            allHypothesi.append(h)
        else:
            print("Yo")
            if not isinstance(h.letter1, Letter):
                allHypothesi.append(h.letter1)
                outputStr += " " + str(h.letter1) + " |"
                hypotLs.append(str(h.letter1).__len__())
            if not isinstance(h.letter2, Letter):
                allHypothesi.append(h.letter2)
                outputStr += " " + str(h.letter2) + " |"
                hypotLs.append(str(h.letter2).__len__())
            if noHypot > 1:
                allHypothesi.append(h)
                outputStr += " " + str(h), + " |"
                hypotLs.append(str(h).__len__())
    noHypot = allHypothesi.__len__()
    outputStr += " " + data + " |\n"
    truthLen = data.__len__()
    firstOne = math.floor(truthLen / 2)
    secondOne = math.ceil(truthLen / 2)
    if secondOne == firstOne:
        secondOne += 1
    else:
        firstOne += 1
    ttl = truthTable.__len__()
    
    binary = 1
    j = 0
    while j < ttl:
        binary *= 2
        j += 1
    binary -= 1
    while binary >= 0:
        outputStr += "|"
        for l in truthTable:
            outputStr += " " + l + " |"
        currentOutput = True
        m = 0
        if noHypot > 1:
            for h in allHypothesi:
                ht = h.checkTrue()
                currentOutput = currentOutput and ht
                if noHypot > 1:
                    j = 0
                    fo = math.floor(hypotLs[m] / 2)
                    so = math.ceil(hypotLs[m] / 2)
                    m += 1
                    if so == fo:
                        so += 1
                    else:
                        fo += 1
                    while j < fo:
                        outputStr += " "
                        j += 1
                    if ht:
                        outputStr += "T"
                    else:
                        outputStr += "F"
                    j = 0
                    while j < so:
                        outputStr += " "
                        j += 1
                    outputStr += "|"
        else:
            for h in hypothesi:
                ht = h.checkTrue()
                currentOutput = currentOutput and ht
        i = 0
        while i < firstOne:
            outputStr += " "
            i += 1
        if currentOutput:
            outputStr += "T"
        else:
            outputStr += "F"
        i = 0
        while i < secondOne:
            outputStr += " "
            i += 1
        outputStr += "|\n"
        #reset the truth table
        binary -= 1
        remainder = binary
        for index, t in enumerate(truthTable):
            twoPower = 1
            k = 0
            while k < ttl - index - 1:
                twoPower *= 2
                k += 1
            if remainder - twoPower >= 0:
                remainder -= twoPower
                t = "T"
            else:
                t = "F"
            truthTable[index] = t
    return outputStr

p = input(" ")
print(solve(p))