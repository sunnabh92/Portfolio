from random import randint

class Words:

    def __init__(self, words):
        # Not really used but would have been when gone into more complex game
        self.word_list = words

class Hangman:

    def __init__(self):
        self.guesses = 0
        self.word = ""
        self.word_list = []
        self.choose = "y"
        self.wins = 0
        self.losses = 0

    def find_random(self):
        # Find a random word to play from the word bank
        self.word = self.word_list[randint(0, len(self.word_list)-1)]
        return self.word

    def display_words(self):
        new_word = ""
        for char in self.get_word():
            new_word += "-"
        return new_word

    def store_words(self):
        # Ask user for a word until they feel they have enough words in the bank
        while self.choose != "n":
            word = input("What word do you want in the word bank? ")
            self.word_list.append(word)
            self.choose = input("Do you want to choose more (Y/N)? ").lower()
            if self.choose == "n":
                break
        return self.word_list

    def get_word(self):
        word_bank = self.store_words()
        self.word = word_bank[randint(0, len(word_bank)-1)]
        return self.word

    def included(self, letter, word, dashed_word):
        # Change the dash from the word to the chosen letter
        partial = list(dashed_word)
        word_in_list = list(word)
        new_dashed = ""
        for i in range(len(dashed_word)):
            if letter == word_in_list[i]:
                partial[i] = letter
        for a in partial:
            new_dashed += a
        return new_dashed
                
    def play_the_game(self):
        dashed_word = self.display_words()
        played_word = self.word.lower()
        try:
            self.guesses = int(input("How many guesses do you want? "))
        except ValueError:
            print("You must choose a number")
            self.guesses = int(input("How many guesses do you want? "))
        while self.guesses > 0:
            # Play the game, while the user has some guesses ask what letter he chooses
            # If the letter is in the word, change from a dash to a letter and one moved used
            # If not, only use one move
            print("You have total of {} guesses".format(self.guesses))
            print("Your word: {}".format(dashed_word))
            print("You have {} guesses left".format(self.guesses))
            guessed_letter = input("What letter do you choose? ").lower()
            if guessed_letter in played_word:
                print("{} is in the word".format(guessed_letter))
                dashed_word = self.included(guessed_letter, played_word, dashed_word)
            else:
                print("{} is not in this word".format(guessed_letter))
            if "-" not in dashed_word:
                print("Yay you won!!")
                self.wins += 1
                play_again = input("Do you want to play again (Y/N)? ").lower()
                if play_again == "n":
                    return
                elif play_again == "y":
                    self.play_the_game()
            self.guesses -= 1
        if self.guesses < 0:
            print("You got no more guesses and lost the game!!")
            self.losses += 1
            play_again = input("Do you want to play again (Y/N)? ").lower()
            if play_again != "n":
                self.play_the_game()
            return

    def wins_and_losses(self):
        return "You have won the game {} times and lost the game {} times".format(self.wins, self.losses)

if __name__ == "__main__":
    game = Hangman()
    game.play_the_game()
    print(game.wins_and_losses())
